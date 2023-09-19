import React, { useState, useEffect,useRef } from "react";
import { Map, Marker, GoogleApiWrapper} from "google-maps-react";


function MapWithMarker(props) {

  const [markers, setMarkers] = useState([]); // State to store marker positions
  const [locationNames, setLocationNames] = useState([]);
  const mapRef = useRef(null);

  const geocoder = new window.google.maps.Geocoder();

  useEffect(() => {
   const storedData = JSON.parse(localStorage.getItem("mapData"));
    if (storedData) {
      setMarkers(storedData.markers);
      setLocationNames(storedData.locationNames);
     
    }
    console.log("mapData",storedData);
  }, []);

  
  const fetchLocationNames = (markerPosition) => {
    //  const newLocationNames = [];

    // Use the geocoder to fetch location names for each marker
    const latLng = new window.google.maps.LatLng(
      markerPosition.lat,
      markerPosition.lng
    );

      geocoder.geocode({ latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          const newLocationNames = [...locationNames];
          newLocationNames.push(results[0].formatted_address);
          console.log(newLocationNames);
          setLocationNames(newLocationNames);
          localStorage.setItem("markers", JSON.stringify({...markers,locationNames:newLocationNames}));
        }
      });
    
  };
  // console.log("locationname",locationNames);
  const handleMapClick = (mapProps, map, clickEvent) => {
    const newMarkerPosition = {
      lat: clickEvent.latLng.lat(),
      lng: clickEvent.latLng.lng(),
    };

    // Add the new marker position to the markers state
    const newMarkers = [...markers, newMarkerPosition];
    setMarkers(newMarkers);
  
     fetchLocationNames(newMarkerPosition);
    
     localStorage.setItem("markers", JSON.stringify({marker:newMarkers,...locationNames}));
    //  console.log("newnames",locationNames);
  };

  const zoomToMarker = (markerPosition) => {
    if (mapRef.current) {
      const map = mapRef.current.map;
      map.setCenter(markerPosition);
      map.setZoom(20); // You can adjust the zoom level as needed
    }
  };

  const mapStyles = {
    width: "100%",
    height: "400px",
  };
  
  
  const ic = {
          url: "http://www.gravatar.com/avatar/d735414fa8687e8874783702f6c96fa6?s=90&d=identicon&r=PG"+`#custom_marker`, // url
          scaledSize: new props.google.maps.Size(50, 50), // scaled size
          origin: new props.google.maps.Point(0,0), // origin
          anchor: new props.google.maps.Point(15, 15), // anchor
          shape:{coords:[17,17,18],type:'circle'},
          optimized:false,
          title: 'spot',
          
      
  }
  
  const name= (index)=>{
       const value = {
          // text: locationNames[index],
          color: "white",
          fontWeight: "bold",
          fontSize: "16px"
       }
       console.log("value",value);
       return value
      }
  return (
    <Map
      google={props.google}
      zoom={14}
      style={mapStyles}
      initialCenter={{ lat: 37.7749, lng: -122.4194 }} // Example initial center (San Francisco)
      onClick={handleMapClick}
      ref={mapRef}
      streetViewControl={false}
      mapTypeControl={false}
      zoomControl={false}
    >
      
      
      {markers.map((markerPosition, index) => (
        
        <Marker
          // label={`${index + 1}`}
          key={index}
          position={markerPosition}
          icon={ic}   
          onClick={() => zoomToMarker(markerPosition)}
          optimized={false}
          //  label={name(index)}
        >
             
        </Marker>
      ))}
      
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_KEY,
  
})(MapWithMarker);
