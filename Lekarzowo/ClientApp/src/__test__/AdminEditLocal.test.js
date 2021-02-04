import AdminEditLocal from '../AdminEditLocal.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminEditLocal  />);
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
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminEditLocal />);
    var comboBoxInput = getByTestId('autocomplete-local');
    var input = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny');
    var editInput = getByLabelText('Nazwa');
    expect(editInput.value).toEqual('Szpital kliniczny');
  });

  it('should display message when succesfuly edited city', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminEditLocal />);
    var comboBoxInput = getByTestId('autocomplete-local');
    var input = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny');
    var editInput = getByLabelText('Nazwa');
    fireEvent.change(editInput, {target:{name: 'Szpital kliniczny 2'}});
    var editBtn = getByText('Edytuj');
    fireEvent.click(editBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
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
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminEditLocal />);
    var comboBoxInput = getByTestId('autocomplete-local');
    var input = getByLabelText('Lokal');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "S" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('Szpital kliniczny');
    var editInput = getByLabelText('Nazwa');
    fireEvent.change(editInput, {target:{name: 'Szpital kliniczny 2'}});
    jest.clearAllMocks();
    const spyGlobalFetchError = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var editBtn = getByText('Edytuj');
    fireEvent.click(editBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');

  });

});
