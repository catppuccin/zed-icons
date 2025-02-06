from pathlib import Path
import shutil
from lxml import etree
from typing import List
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
class SVGProcessor:

    VIEWBOX_VALUE = "0 0 16 16"
    ATTRIBUTES_TO_REMOVE = {'width', 'height'}

    def __init__(self, themes: List[str]):
        self.themes = themes
        self.base_dir = Path.cwd()
        self.src_dir = self.base_dir / "src" / "vscode-icons"
        self.icons_dir = self.base_dir / "icons"
        self.assets_dir = self.base_dir / "assets"

    def setup_directories(self) -> None:
        """Create and populate icon directories."""
        try:
            # Setup icons directory
            self.icons_dir.mkdir(exist_ok=True)

            # Copy theme directories
            for theme in self.themes:
                src_path = self.src_dir / "icons" / theme
                dst_path = self.icons_dir / theme
                shutil.copytree(src_path, dst_path, dirs_exist_ok=True)
                logger.info(f"Copied theme directory: {theme}")

            # Handle assets directory
            if self.assets_dir.exists():
                shutil.rmtree(self.assets_dir)
            shutil.copytree(self.src_dir / "assets", self.assets_dir)
            logger.info("Assets directory updated")

        except Exception as e:
            logger.error(f"Directory setup failed: {e}")
            raise

    def process_svg(self, file_path: Path) -> None:
        try:
            # Parse SVG with XML parser
            parser = etree.XMLParser(remove_blank_text=True)
            tree = etree.parse(str(file_path), parser)
            root = tree.getroot()

            # Track if we made changes
            changes_made = False

            # Remove width and height attributes if they exist
            for attr in self.ATTRIBUTES_TO_REMOVE:
                if attr in root.attrib:
                    del root.attrib[attr]
                    changes_made = True

            # Update viewBox
            current_viewbox = root.get('viewBox')
            if current_viewbox != self.VIEWBOX_VALUE:
                root.set('viewBox', self.VIEWBOX_VALUE)
                changes_made = True

            if changes_made:
                # Write back only if changes were made
                tree.write(
                    str(file_path),
                    pretty_print=True,
                    encoding='utf-8',
                    xml_declaration=True
                )
                logger.info(f"Updated {file_path.name}")
            else:
                logger.debug(f"No changes needed for {file_path.name}")

        except etree.XMLSyntaxError as e:
            logger.error(f"XML syntax error in {file_path.name}: {e}")
        except Exception as e:
            logger.error(f"Error processing {file_path.name}: {e}")

    def verify_svg(self, file_path: Path) -> bool:
        """Verify SVG has correct attributes after processing."""
        try:
            tree = etree.parse(str(file_path))
            root = tree.getroot()

            # Check that width and height are removed
            for attr in self.ATTRIBUTES_TO_REMOVE:
                if attr in root.attrib:
                    logger.error(f"{file_path.name} still has {attr} attribute")
                    return False

            # Check viewBox is correct
            if root.get('viewBox') != self.VIEWBOX_VALUE:
                logger.error(f"{file_path.name} has incorrect viewBox")
                return False

            return True
        except Exception as e:
            logger.error(f"Error verifying {file_path.name}: {e}")
            return False

    def process_theme(self, theme: str) -> None:
        """Process all SVG files in a theme directory."""
        theme_dir = self.icons_dir / theme
        svg_files = list(theme_dir.glob("*.svg"))

        for svg_file in svg_files:
            self.process_svg(svg_file)
            if not self.verify_svg(svg_file):
                logger.warning(f"Verification failed for {svg_file.name}")

    def process_all_themes(self) -> None:
        """Process SVG files for all themes."""
        for theme in self.themes:
            logger.info(f"Processing theme: {theme}")
            self.process_theme(theme)

def main() -> None:
    """Main execution function."""
    themes = ["frappe", "latte", "macchiato", "mocha"]

    try:
        processor = SVGProcessor(themes)
        processor.setup_directories()
        processor.process_all_themes()
        logger.info("Processing completed successfully")

    except Exception as e:
        logger.error(f"Processing failed: {e}")
        raise

if __name__ == "__main__":
    main()
