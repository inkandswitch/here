/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { ChakraProvider, Button, Stack } from '@chakra-ui/react';
import PeopleDrawer from './components/PeopleDrawer';
import Map from './components/Map';

function App() {
  const [askedLocation, setAskedLocation] = useState(false);

  function success(pos) {
    var crd = pos.coords;

    let message = JSON.stringify(crd);
    console.log(message);

    // TODO send message to backend
  }

  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

  useEffect(() => {
    if (!askedLocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };

      const id = navigator.geolocation.watchPosition(success, error, options);
      setAskedLocation(true);

      return () => navigator.geolocation.clearWatch(id);
    }
  }, [askedLocation, setAskedLocation]);

  return (
    <ChakraProvider>
      <Map />
      <Stack spacing={4} direction="row" align="center">
        <Button>Share Location</Button>
        <Button>Redeem code</Button>
        <PeopleDrawer />
      </Stack>
    </ChakraProvider>
  );
}

export default App;
