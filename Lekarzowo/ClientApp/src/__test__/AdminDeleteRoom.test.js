import AdminDeleteRoom from '../AdminDeleteRoom.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminDeleteRoom  />);
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
    const {debug, getByRole, getByTestId, getByLabelText} = render(<AdminDeleteRoom />);
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
    comboBoxInput = getByTestId('autocomplete-rooms');
    input = getByLabelText('Pokój');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "1" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('100');
  });

  it('should display message when succesfuly deleted room', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminDeleteRoom />);
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
    comboBoxInput = getByTestId('autocomplete-rooms');
    input = getByLabelText('Pokój');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "1" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('100');
    var deleteBtn = getByText('Usuń');
    fireEvent.click(deleteBtn);
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

  it('should display error message when unable to delete room', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByTestId, getByLabelText, getByText} = render(<AdminDeleteRoom />);
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
    comboBoxInput = getByTestId('autocomplete-rooms');
    input = getByLabelText('Pokój');
    comboBoxInput.focus();
    fireEvent.change(input, { target: { value: "1" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(input.value).toEqual('100');
    jest.clearAllMocks();
    const spyGlobalFetchError = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var deleteBtn = getByText('Usuń');
    fireEvent.click(deleteBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
