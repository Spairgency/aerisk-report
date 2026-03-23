from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class MetadataSchemaV1(BaseModel):
    """
    Metadata schema version 1 for AERISK engine.
    
    This schema defines the structure for metadata associated with the AERISK engine.
    It includes information about the dataset, features, and additional properties.
    """

    dataset_name: str = Field(..., description="Name of the dataset")
    version: str = Field(..., description="Version of the metadata schema")
    description: Optional[str] = Field(None, description="Description of the dataset")
    features: List[Dict[str, Any]] = Field(
        ...,
        description=(
            "List of feature definitions. Each feature is a dictionary containing "
            "name, type, and optional description and properties."
        )
    )
    properties: Optional[Dict[str, Any]] = Field(
        None,
        description="Additional properties related to the metadata"
    )

    class Config:
        schema_extra = {
            "example": {
                "dataset_name": "AERISK Sample Dataset",
                "version": "1.0",
                "description": "Sample metadata for AERISK engine dataset.",
                "features": [
                    {
                        "name": "temperature",
                        "type": "float",
                        "description": "Temperature in Celsius",
                        "properties": {"unit": "Celsius", "range": [-50, 50]}
                    },
                    {
                        "name": "humidity",
                        "type": "float",
                        "description": "Relative humidity percentage",
                        "properties": {"unit": "%", "range": [0, 100]}
                    }
                ],
                "properties": {
                    "source": "simulated",
                    "created_by": "AERISK Team",
                    "creation_date": "2025-01-01"
                }
            }
        }
