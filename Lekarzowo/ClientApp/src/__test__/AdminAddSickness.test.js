import AdminAddSickness from '../AdminAddSickness.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminAddSickness  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display validation erros when inputs are not filled in', async () => {
    const {debug, getByText, getByRole} = render(<AdminAddSickness />);
    var btn = getByText('Dodaj');
    fireEvent.click(btn)
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });


  it('should be able to fill inputs', () => {
    const {debug, getByRole} = render(<AdminAddSickness />);
    var input = getByRole('textbox');
    fireEvent.change(input, {target : {value: "Ból głowy"}});
    expect(input.value).toEqual('Ból głowy');
  });

  it('should display message when succesfuly added sickness', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByText} = render(<AdminAddSickness />);
    var input = getByRole('textbox');
    fireEvent.change(input, {target : {value: "Ból głowy"}});
    expect(input.value).toEqual('Ból głowy');
    var btn = getByText('Dodaj');
    fireEvent.click(btn);
    expect(spyGlobalFetch).toHaveBeenCalled();
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

  it('should display error message when unable to add medicine', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    const {debug, getByRole, getByText} = render(<AdminAddSickness />);
    var input = getByRole('textbox');
    fireEvent.change(input, {target : {value: "Ból głowy"}});
    expect(input.value).toEqual('Ból głowy');
    var btn = getByText('Dodaj');
    fireEvent.click(btn);
    expect(spyGlobalFetch).toHaveBeenCalled();
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
