from typing import List

class Api:
    """
        The JavaScript <-> Python interface. Adding a function here will allow you to
        access it in JavaScript via window.pywebview.api
        
        [documentation](https://pywebview.flowrl.com/guide/api.html#webview-create-window)
    """

    def find_depth(image_id: str) -> List[List[float]]:
        """
        Finds the z coordinate for every pixel in the image. Will be called when the user places modal on panorama.
        """
        pass

    def add_tour_asset(asset: str, type: str) -> dict:
        """
        Takes in an asset in JavaScript (a large file: panorama image, or path video etc.  ) and sends it to the Python Application Layer.
        """
        pass

    def get_tour_asset(image_id: str) -> str:
        """
        NOTE: Possibly not needed in api. Panorama uri will already exist in the full graph that is already in JavaScript memory, so JavaScript can likely just reach out itself and fetch the image.
        """
        pass

    def delete_tour_asset(section_id: str) -> dict:
        """
        Deletes local assets related to a path or panorama. Uses Server API to delete corresponding asset in server.
        """
        pass

    def save_changes(tour_graph:dict) -> bool:
        """
        Saves all edits made to the tour graph.
        """
        pass

    def fetch_tour_graph() -> dict:
        """
        Called by JS UI when the app is first opened. Passes the tour graph as a json dictionary to the editor UI the user can navigate the graph visually.
        """
        pass