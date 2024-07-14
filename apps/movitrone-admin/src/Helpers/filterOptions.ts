export const filterOption: (inputValue: string, option: any) => boolean = (
  inputValue,
  option,
) => option?.label?.toLowerCase().includes(inputValue.toLowerCase());

export const filterCodeNumber: (inputValue: string, option: any) => boolean = (
  inputValue,
  option,
) =>
  option?.label.props.children[0].props.children
    ?.toLowerCase()
    .includes(inputValue.toLowerCase());

export const filterCountry: (inputValue: string, option: any) => boolean = (
  inputValue,
  option,
) =>
  option?.label.props.children.props.children[1].props.children
    ?.toLowerCase()
    .includes(inputValue.toLowerCase());
