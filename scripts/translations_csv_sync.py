#!/usr/bin/env python3
"""Sync translation JSON files with a Google Sheets-friendly CSV.

CSV schema:
- key_1,key_2,key_3,<locale1>,<locale2>,...
- 2-level keys are represented with an empty key_3 cell.
"""

import argparse
import csv
import json
from pathlib import Path
from typing import Dict, List, Tuple


def _load_json(path: Path) -> Dict[str, object]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError(f"Expected top-level object in {path}")
    return data


def _flatten_locale_dict(
    data: Dict[str, object],
    locale: str,
    path_parts: Tuple[str, ...] = (),
    out: Dict[Tuple[str, str, str], str] | None = None,
) -> Dict[Tuple[str, str, str], str]:
    if out is None:
        out = {}

    for key, value in data.items():
        if not isinstance(key, str):
            raise ValueError(f"Non-string key in locale '{locale}' at {path_parts!r}")

        current = path_parts + (key,)
        if isinstance(value, dict):
            if len(current) >= 3:
                raise ValueError(
                    f"Locale '{locale}' has nesting deeper than 3 levels at {'.'.join(current)}"
                )
            _flatten_locale_dict(value, locale, current, out)
            continue

        if not isinstance(value, str):
            raise ValueError(
                f"Locale '{locale}' has non-string value at {'.'.join(current)}: {type(value).__name__}"
            )

        if len(current) > 3:
            raise ValueError(
                f"Locale '{locale}' has nesting deeper than 3 levels at {'.'.join(current)}"
            )

        padded = current + ("",) * (3 - len(current))
        out[padded] = value

    return out


def combine_langs_to_csv(translations_dir: Path | str, csv_output: Path | str) -> Path:
    """Combine all language files from /translations into one CSV file."""
    messages_path = Path(translations_dir)
    output_path = Path(csv_output)

    json_files = sorted(messages_path.glob("*.json"))
    if not json_files:
        raise FileNotFoundError(f"No .json files found in {messages_path}")

    locale_maps: Dict[str, Dict[Tuple[str, str, str], str]] = {}
    all_keys: set[Tuple[str, str, str]] = set()

    for json_file in json_files:
        locale = json_file.stem
        flattened = _flatten_locale_dict(_load_json(json_file), locale)
        locale_maps[locale] = flattened
        all_keys.update(flattened.keys())

    locales = sorted(locale_maps.keys())
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["", "", "", *locales])

        for key_1, key_2, key_3 in sorted(all_keys):
            row = [key_1, key_2, key_3]
            for locale in locales:
                row.append(locale_maps[locale].get((key_1, key_2, key_3), ""))
            writer.writerow(row)

    return output_path


def _insert_translation(target: Dict[str, object], keys: Tuple[str, ...], value: str) -> None:
    cursor: Dict[str, object] = target
    for key in keys[:-1]:
        existing = cursor.get(key)
        if existing is None:
            next_obj: Dict[str, object] = {}
            cursor[key] = next_obj
            cursor = next_obj
            continue
        if not isinstance(existing, dict):
            dotted = ".".join(keys)
            raise ValueError(f"Conflicting keys for '{dotted}' (leaf/object collision)")
        cursor = existing

    leaf_key = keys[-1]
    existing_leaf = cursor.get(leaf_key)
    if isinstance(existing_leaf, dict):
        dotted = ".".join(keys)
        raise ValueError(f"Conflicting keys for '{dotted}' (object/leaf collision)")
    cursor[leaf_key] = value


def _key_cells_to_tuple(key_1: str, key_2: str, key_3: str, row_number: int) -> Tuple[str, ...]:
    if not key_1:
        raise ValueError(f"Row {row_number}: key_1 is required")
    if key_3 and not key_2:
        raise ValueError(f"Row {row_number}: key_3 cannot be set when key_2 is empty")

    keys: List[str] = [key_1]
    if key_2:
        keys.append(key_2)
    if key_3:
        keys.append(key_3)
    return tuple(keys)

def _normalize_header(header: List[str]) -> List[str]:
    if len(header) < 4:
        raise ValueError("CSV must have at least 4 columns")

    header_variants = {
        ("", "", ""),
        ("L1", "L2", "L3"),
    }
    key_header = tuple(cell.strip() for cell in header[:3])
    if key_header not in header_variants:
        raise ValueError(
            "CSV must start with blank columns, or L1/L2/L3"
        )

    locales = [cell.strip() for cell in header[3:]]
    if not locales or any(not locale for locale in locales):
        raise ValueError("CSV must include non-empty locale columns after the first 3 columns")

    return locales

def csv_to_lang_files(csv_input: Path | str, translations_dir: Path | str) -> List[Path]:
    """Convert a spreadsheet CSV export back into per-locale JSON files."""
    csv_path = Path(csv_input)
    messages_path = Path(translations_dir)
    messages_path.mkdir(parents=True, exist_ok=True)

    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.reader(handle)

        try:
            header = next(reader)
        except StopIteration as exc:
            raise ValueError("CSV has no header") from exc

        if header is None:
            raise ValueError("CSV has no header")

        locales = _normalize_header(header)
        if not locales:
            raise ValueError("CSV must include at least one locale column")

        rows = list(reader)

    locale_data: Dict[str, Dict[str, object]] = {locale: {} for locale in locales}
    seen_keys: set[Tuple[str, ...]] = set()

    expected_columns = 3 + len(locales)

    for idx, row in enumerate(rows, start=2):
        if len(row) < expected_columns:
            row = row + [""] * (expected_columns - len(row))
        elif len(row) > expected_columns:
            raise ValueError(f"Row {idx}: expected {expected_columns} columns, found {len(row)}")

        key_1 = row[0].strip()
        key_2 = row[1].strip()
        key_3 = row[2].strip()
        if not key_1 and not key_2 and not key_3:
            continue

        key_tuple = _key_cells_to_tuple(key_1, key_2, key_3, idx)

        if key_tuple in seen_keys:
            raise ValueError(f"Row {idx}: duplicate translation key {'.'.join(key_tuple)}")
        seen_keys.add(key_tuple)

        for locale, value in zip(locales, row[3:]):
            _insert_translation(locale_data[locale], key_tuple, value)

    written: List[Path] = []
    for locale, data in locale_data.items():
        output_path = messages_path / f"{locale}.json"
        with output_path.open("w", encoding="utf-8") as handle:
            json.dump(data, handle, ensure_ascii=False, indent=2)
            handle.write("\n")
        written.append(output_path)

    return written


_DEFAULT_TRANSLATIONS_DIR = Path(__file__).parent.parent / "src" / "translations"
_DEFAULT_CSV_OUT = _DEFAULT_TRANSLATIONS_DIR / "export.csv"


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert translation files between /translations JSON and spreadsheet CSV."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    to_csv = subparsers.add_parser("to-csv", help="Combine /translations JSON files into one CSV")
    to_csv.add_argument(
        "--translations-dir", type=Path, default=_DEFAULT_TRANSLATIONS_DIR,
        help=f"Source translations directory (default: {_DEFAULT_TRANSLATIONS_DIR})",
    )
    to_csv.add_argument(
        "--out", type=Path, default=_DEFAULT_CSV_OUT,
        help=f"Output CSV file (default: {_DEFAULT_CSV_OUT})",
    )

    from_csv = subparsers.add_parser(
        "from-csv", help="Convert spreadsheet CSV export back to locale JSON files"
    )
    from_csv.add_argument(
        "--csv", type=Path, default=_DEFAULT_CSV_OUT,
        help=f"Input CSV file (default: {_DEFAULT_CSV_OUT})",
    )
    from_csv.add_argument(
        "--translations-dir", type=Path, default=_DEFAULT_TRANSLATIONS_DIR,
        help=f"Output translations directory (default: {_DEFAULT_TRANSLATIONS_DIR})",
    )

    return parser.parse_args()


def main() -> None:
    args = _parse_args()

    if args.command == "to-csv":
        out_path = combine_langs_to_csv(args.translations_dir, args.out)
        print(f"Wrote CSV: {out_path}")
        return

    if args.command == "from-csv":
        written = csv_to_lang_files(args.csv, args.translations_dir)
        print(f"Wrote {len(written)} locale files to {args.translations_dir}")
        return

    raise RuntimeError(f"Unsupported command: {args.command}")


if __name__ == "__main__":
    main()

