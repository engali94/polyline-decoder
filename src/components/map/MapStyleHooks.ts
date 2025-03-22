import { useState, useEffect } from 'react';
import { loadCustomStyles } from '../../utils/mapStyles';
import { StyleOption } from './StyleSelector';

export const useMapStyles = () => {
  const [styleOptions, setStyleOptions] = useState<StyleOption[]>([]);
  const [currentStyleId, setCurrentStyleId] = useState<string>('voyager');

  useEffect(() => {
    const builtInStyles = Object.entries(mapStyles).map(([id, style]) => ({
      id,
      name: style.name,
      url: style.url,
    }));

    const customStyles = Object.entries(loadCustomStyles()).map(([id, style]) => ({
      id,
      name: style.name,
      url: style.url,
      isCustom: true,
    }));

    setStyleOptions([...builtInStyles, ...customStyles]);
  }, []);

  return {
    styleOptions,
    setStyleOptions,
    currentStyleId,
    setCurrentStyleId,
  };
};
import { mapStyles } from '../../utils/mapStyles';
