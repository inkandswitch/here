import { useEffect, useState } from 'react';

import { Code } from '../../backend/types';

import Backchannel from '../../backend';
import usePrevious from '../hooks/usePrevious';
import useCountdown from '../hooks/useCountdown';

export enum CodeType {
  WORDS = 'words',
  NUMBERS = 'numbers',
}

let backchannel = Backchannel();

/**
 * Get a connection code and its corresponding QR Code image string. Automatically refreshes every `refreshRateSec` seconds.
 *
 * @param {CodeType} codeType The code to accept
 * @param {number} timeout The refresh rate in seconds. Default is 60 seconds.
 * @returns {Code} An invite code.
 */
export default function useCode(
  codeType: CodeType,
  timeout: number = 60
): Code {
  const [code, setCode] = useState('');
  const [timeRemaining, resetCountdown] = useCountdown(timeout);
  const previousCodeType = usePrevious(codeType);

  // Generate new code and reset countdown when timer runs out
  // or if the codeType changes
  useEffect(() => {
    if (timeRemaining === 0 || previousCodeType !== codeType) {
      // Clear the code before getting a new one so
      // stale codes don't linger
      setCode('');

      getCode(codeType).then((code) => {
        if (code) {
          setCode(code);
          resetCountdown();
        }
      });
    }
  }, [timeRemaining, codeType, previousCodeType, resetCountdown, code]);

  // Generate new code if there isn't a code already.
  useEffect(() => {
    if (!code) {
      // Clear the code before getting a new one so
      // stale codes don't linger
      setCode('');

      getCode(codeType).then((code) => {
        if (code) {
          setCode(code);
          resetCountdown();
        }
      });
    }
  }, [code, codeType, resetCountdown]);

  return code;
}

const getCode = async (codeType): Promise<Code> => {
  try {
    let code: Code;
    switch (codeType) {
      case CodeType.WORDS:
        code = await backchannel.getCode();
        return code;
      case CodeType.NUMBERS:
        code = await backchannel.getNumericCode();
        return code;
      default:
        return null;
    }
  } catch (err) {
    if (err.message.startsWith('This code has expired')) {
      // TODO differentiate between an actual backend err (which should be displayed) vs the code timing out (which should happen quietly).
    } else {
      console.error('got error from backend', err);
    }
  }
};
