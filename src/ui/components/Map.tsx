/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Box } from '@chakra-ui/react';

// add an exclamation point to exclude mapbox-gl from transpilation
// https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/#add-mapbox-gl-js
// @ts-ignore
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

// TODO don't commit this probably
mapboxgl.accessToken = '';

const MapWrapper = styled(Box)`
  width: 100%;
  height: 100%;
`;

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <MapWrapper>
      <div
        ref={mapContainer}
        css={css`
          height: 300px;
        `}
      />
      <Box>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </Box>
    </MapWrapper>
  );
}
