import AdminEditTreatment from '../AdminEditTreatment.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminEditTreatment  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should be able to select edited data', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminEditTreatment />);
    var comboBoxInput = getByTestId('autocomplete-treatment');
    var input = getByLabelText('Zabieg');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "R" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Rentgen');
    var editInput = getByLabelText('Nazwa zabiegu');
    expect(editInput.value).toEqual('Rentgen');
  });

  it('should display message when succesfuly edited city', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminEditTreatment />);
    var comboBoxInput = getByTestId('autocomplete-treatment');
    var input = getByLabelText('Zabieg');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "R" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Rentgen');
    var editInput = getByLabelText('Nazwa zabiegu');
    fireEvent.change(editInput, {target:{name: 'Rentgen 2'}});
    var editBtn = getByText('Edytuj');
    fireEvent.click(editBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('green-snackbar');
  });

});

describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display error message when unable to edit city', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminEditTreatment />);
    var comboBoxInput = getByTestId('autocomplete-treatment');
    var input = getByLabelText('Zabieg');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "R" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Rentgen');
    var editInput = getByLabelText('Nazwa zabiegu');
    fireEvent.change(editInput, {target:{name: 'Rentgen 2'}});
    jest.clearAllMocks();
    const spyGlobalFetchError = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var editBtn = getByText('Edytuj');
    fireEvent.click(editBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');

  });

});
