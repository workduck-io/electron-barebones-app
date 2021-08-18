import React, { useState } from 'react';
import { ActionMeta } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { ThemeConfig } from 'react-select/src/theme';
import { useTheme, DefaultTheme } from 'styled-components';
import { useFlatTreeFromILinks } from '../../Editor/Store/DataStore';
import { getOptions } from '../../Lib/flatTree';
import { Value } from './Types';

interface SelectState {
  options: { label: string; value: string }[];
  value: Value | null;
}

interface LookupInputProps {
  menuOpen?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  handleChange: (
    newValue: Value | null,
    _actionMeta: ActionMeta<Value> // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => void;
  handleCreate?: (inputValue: string) => void;
}

const LookupInput = ({ handleChange, handleCreate, loading: LoadingProp, autoFocus, menuOpen }: LookupInputProps) => {
  const defaultOptions = getOptions(useFlatTreeFromILinks());
  const [state, setState] = useState<SelectState>({
    options: defaultOptions,
    value: null,
  });
  const [loading, setLoading] = useState(LoadingProp);

  const theme: DefaultTheme = useTheme();

  const handleCreateWrapper = (inputValue: string) => {
    setLoading(true);
    if (handleCreate) handleCreate(inputValue);
    setState({ ...state, value: { label: inputValue, value: inputValue } });

    setLoading(false);
  };

  const handleChangeWrapper = (newValue: Value | null, _actionMeta: ActionMeta<Value>) => {
    setLoading(true);
    // setState({ ...state, isLoading: true });
    handleChange(newValue, _actionMeta);

    setState({ ...state, value: newValue });
    setLoading(false);
  };

  const { options, value } = state;

  const colors = {
    primary: theme.colors.primary,
    primary75: theme.colors.fade.primary,
    primary50: theme.colors.secondary,
    primary25: theme.colors.fade.primary,
    danger: theme.colors.palette.red,
    dangerLight: '#FFBDAD',

    neutral0: theme.colors.gray[9],
    neutral5: theme.colors.gray[8],
    neutral10: theme.colors.gray[7],
    neutral20: theme.colors.gray[6],
    neutral30: theme.colors.gray[5],
    neutral40: theme.colors.gray[2],
    neutral50: theme.colors.gray[2],
    neutral60: theme.colors.gray[2],
    neutral70: theme.colors.gray[1],
    neutral80: theme.colors.gray[0],
    neutral90: theme.colors.gray[0],
  };

  const borderRadius = 4;
  // Used to calculate consistent margin/padding on elements
  const baseUnit = 4;
  // The minimum height of the control
  const controlHeight = 38;
  // The amount of space between the control and menu */
  const menuGutter = baseUnit * 2;

  const spacing = {
    baseUnit,
    controlHeight,
    menuGutter,
  };

  const customTheme: ThemeConfig = {
    borderRadius,
    colors,
    spacing,
  };

  return (
    <CreatableSelect
      isClearable
      // isDisabled={loading}
      isLoading={loading}
      onChange={handleChangeWrapper}
      onCreateOption={handleCreateWrapper}
      options={options}
      defaultMenuIsOpen={menuOpen}
      value={value}
      autoFocus={autoFocus}
      theme={customTheme}
    />
  );
};

LookupInput.defaultProps = {
  handleCreate: () => {},
  menuOpen: false,
  loading: false,
  autoFocus: false,
};

export default LookupInput;