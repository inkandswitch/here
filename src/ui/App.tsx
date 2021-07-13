import React, { useEffect } from 'react';
import { ChakraProvider, Button, Stack, Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import PeopleDrawer from './components/PeopleDrawer';

const MapWrapper = styled(Box)`
  width: 100%;
  height: 100%;
`;

function App() {
  var target, options;

  function success(pos) {
    var crd = pos.coords;

    let message = JSON.stringify(crd);
  }

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0,
  };

  useEffect(() => {
    let id = navigator.geolocation.watchPosition(success, error, options);
  });

  // to clear:  navigator.geolocation.clearWatch(id);
  return (
    <ChakraProvider>
      <MapWrapper>map</MapWrapper>
      <Stack spacing={4} direction="row" align="center">
        <Button>Share Location</Button>
        <Button>Redeem code</Button>
        <PeopleDrawer />
      </Stack>
    </ChakraProvider>
  );
}

export default App;
