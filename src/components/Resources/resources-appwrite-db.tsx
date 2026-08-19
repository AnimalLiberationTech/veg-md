import {Client, Databases, Query} from "appwrite";
import {appwriteEndpoint, appwriteProjectId} from "@/constants";
import {Feature, ResourceLink} from "@/types/feature";

const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

const databases = new Databases(client);

const DATABASE_ID = "resources";
const RESOURCES_COLLECTION_ID = "resources";
const LOCALIZED_RESOURCES_COLLECTION_ID = "localized_resources";
const LOCALIZED_RESOURCE_LINKS_COLLECTION_ID = "localized_resource_links";
const RATINGS_COLLECTION_ID = "localized_resource_ratings";

export async function getResourcesAppwriteDb(locale: string): Promise<Feature[]> {
  try {
    // 1. Get localized resources for the given locale
    const localizedDocs = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: LOCALIZED_RESOURCES_COLLECTION_ID,
      queries: [
        Query.equal("locale", [locale]),
        Query.isNull("deleted_at"),
      ]
    });

    if (localizedDocs.total === 0) {
      return [];
    }

    // SQLite query had a ranking logic based on 'method' and 'updated_at'.
    // Appwrite doesn't support ROW_NUMBER() OVER PARTITION BY.
    // We'll have to do some manual filtering/ranking if there are multiple localized resources per resource.
    
    const resourceMap = new Map<number, any>();
    for (const doc of localizedDocs.documents) {
      const resourceId = doc.resource_id;
      const existing = resourceMap.get(resourceId);
      
      if (!existing) {
        resourceMap.set(resourceId, doc);
      } else {
        // Ranking logic: voiceover (0) > subtitles (1) > else (2)
        const getRank = (method: string) => {
          if (method === 'voiceover') return 0;
          if (method === 'subtitles') return 1;
          return 2;
        };
        
        const currentRank = getRank(doc.method);
        const existingRank = getRank(existing.method);
        
        if (currentRank < existingRank) {
          resourceMap.set(resourceId, doc);
        } else if (currentRank === existingRank) {
          if (new Date(doc.updated_at) > new Date(existing.updated_at)) {
            resourceMap.set(resourceId, doc);
          } else if (new Date(doc.updated_at).getTime() === new Date(existing.updated_at).getTime()) {
             if (doc.$id > existing.$id) {
                 resourceMap.set(resourceId, doc);
             }
          }
        }
      }
    }

    const selectedLocalizedDocs = Array.from(resourceMap.values());
    const resourceIds = selectedLocalizedDocs.map(doc => doc.resource_id);

    // 2. Get the actual resource data for these localized docs
    // Appwrite Query.equal can take an array for "IN" behavior
    const resourceDocs = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: RESOURCES_COLLECTION_ID,
      queries: [
        Query.equal("id", resourceIds),
        Query.isNull("deleted_at"),
      ]
    });

    const resourcesById = new Map<number, any>();
    resourceDocs.documents.forEach(doc => resourcesById.set(doc.id, doc));

    // 3. Get links for these localized resources
    const localizedIds = selectedLocalizedDocs.map(doc => doc.id);
    const linkDocs = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: LOCALIZED_RESOURCE_LINKS_COLLECTION_ID,
      queries: [
        Query.equal("localized_resource_id", localizedIds),
        Query.isNull("deleted_at"),
      ]
    });

    const linksByLocalizedId = new Map<number, ResourceLink[]>();
    linkDocs.documents.forEach(doc => {
      const current = linksByLocalizedId.get(doc.localized_resource_id) ?? [];
      current.push({ type: doc.type, url: doc.url });
      linksByLocalizedId.set(doc.localized_resource_id, current);
    });

    // 4. Get ratings to calculate average
    // Note: In a real app, you might want to pre-calculate average_rating or use a specialized function
    // But here we'll follow the SQLite logic which calculates it on the fly
    const ratingDocs = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: RATINGS_COLLECTION_ID,
      queries: [
        Query.equal("localized_resource_id", localizedIds),
      ]
    });

    const ratingsByLocalizedId = new Map<number, number[]>();
    ratingDocs.documents.forEach(doc => {
      const current = ratingsByLocalizedId.get(doc.localized_resource_id) ?? [];
      current.push(doc.rating);
      ratingsByLocalizedId.set(doc.localized_resource_id, current);
    });

    // 5. Assemble the Feature objects
    const results: Feature[] = selectedLocalizedDocs.map(rlr => {
      const r = resourcesById.get(rlr.resource_id);
      if (!r) return null;

      const ratings = ratingsByLocalizedId.get(rlr.id) ?? [];
      const average_rating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;

      return {
        id: rlr.id,
        title: rlr.title,
        description: rlr.description,
        image_url: rlr.image_url || r.image_url,
        type: r.type,
        slug: r.slug,
        average_rating,
        links: linksByLocalizedId.get(rlr.id) ?? [],
      } satisfies Feature;
    }).filter((f): f is Feature => f !== null);

    // 6. Sort and Limit
    results.sort((a, b) => {
      if ((b.average_rating || 0) !== (a.average_rating || 0)) {
        return (b.average_rating || 0) - (a.average_rating || 0);
      }
      return b.id - a.id;
    });

    return results.slice(0, 12);

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Appwrite fetch error:", error);
    }
    return [];
  }
}
