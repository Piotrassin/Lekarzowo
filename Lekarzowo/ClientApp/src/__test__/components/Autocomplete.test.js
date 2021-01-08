import Autocomplete from '../../components/Autocomplete.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';


const autocompleteProps = {
  title: "Choroba",
  cssId: "medicine-search",
  variant: "outlined",
  clear: true,
  addId: 1,
  styles: { width: "94%"}
};

it('renders', () => {
  shallow(<Autocomplete  />);
});

it('accepts props', () => {
  var wrapper = mount(<Autocomplete title = {autocompleteProps.title} cssId = {autocompleteProps.cssId}
    variant = {autocompleteProps.variant} clear = {autocompleteProps.clear}
    addId = {autocompleteProps.addId}  styles = {autocompleteProps.styles}/>);
  expect(wrapper.props().title).toEqual(autocompleteProps.title);
  expect(wrapper.props().cssId).toEqual(autocompleteProps.cssId);
  expect(wrapper.props().variant).toEqual(autocompleteProps.variant);
  expect(wrapper.props().clear).toEqual(autocompleteProps.clear);
  expect(wrapper.props().addId).toEqual(autocompleteProps.addId);
  expect(wrapper.props().styles).toEqual(autocompleteProps.styles);

});

describe("Component functionality",  () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch supplied callback when changing input', async () => {
    const mockedCallBack = jest.fn((search, limit, skip, id)  =>
    Promise.resolve(
      [
        {id: 1, name: "test1"},
        {id: 2, name: "test2"}
      ]
    ));
    const {debug, getByRole, getAllByRole} = render(<Autocomplete title = {autocompleteProps.title} cssId = {autocompleteProps.cssId}
      variant = {autocompleteProps.variant} clear = {autocompleteProps.clear}
      addId = {autocompleteProps.addId}  styles = {autocompleteProps.styles}
      requestCallback = {mockedCallBack}/>);
      var input = getByRole('textbox');
      fireEvent.change(input, { target: { value: "T" }});
      await wait(() => expect(mockedCallBack).toHaveBeenCalledTimes(2));
      var inputOptions = getAllByRole('option');
      var inputOptions = inputOptions.map((el, id) => {
        return el.innerHTML.split('<span')[0]
      });
      expect(inputOptions).toContain("test1");
      expect(inputOptions).toContain("test2");
  });

  it('should show No options, when the fetch returns []', async () => {
    const mockedCallBack = jest.fn((search, limit, skip, id)  =>
    Promise.resolve(
      []
    ));
    const {debug, getByRole, getByText} = render(<Autocomplete title = {autocompleteProps.title} cssId = {autocompleteProps.cssId}
      variant = {autocompleteProps.variant} clear = {autocompleteProps.clear}
      addId = {autocompleteProps.addId}  styles = {autocompleteProps.styles}
      requestCallback = {mockedCallBack}/>);
      var input = getByRole('textbox');
      fireEvent.change(input, { target: { value: "T" }});
      await wait(() => expect(mockedCallBack).toHaveBeenCalledTimes(2));
      var noOptionsText = getByText('No options');

  });

  it('should select option when selected from drop down list', async () => {
    const mockedCallBack = jest.fn((search, limit, skip, id)  =>
    Promise.resolve(
      [
        {id: 1, name: "test1"},
        {id: 2, name: "test2"}
      ]
    ));
    const mockedChangeCallBack = jest.fn((value)  =>{
      return value
    });
    const {debug, getByRole, getAllByRole} = render(<Autocomplete title = {autocompleteProps.title} cssId = {autocompleteProps.cssId}
      variant = {autocompleteProps.variant} clear = {autocompleteProps.clear}
      addId = {autocompleteProps.addId}  styles = {autocompleteProps.styles}
      requestCallback = {mockedCallBack} changeCallback = {mockedChangeCallBack}/>);
      var input = getByRole('textbox');
      fireEvent.change(input, { target: { value: "T" }});
      await wait(() => expect(mockedCallBack).toHaveBeenCalledTimes(2));
      var optionToSelect = getByRole('option', {name: 'test1'});
      fireEvent.click(optionToSelect);
      expect(input.value).toEqual('test1');
      expect(mockedChangeCallBack).toHaveBeenCalledTimes(1);
  });


});
