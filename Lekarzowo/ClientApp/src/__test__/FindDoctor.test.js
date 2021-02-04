import FindDoctor from '../FindDoctor.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<FindDoctor  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should be able to fill input', () => {
    const {debug, getByRole, getByLabelText} = render(<FindDoctor />);
    var input = getByLabelText('Doktor');
    fireEvent.change(input, {target : {value: "A"}});
    expect(input.value).toEqual('A');
  });

  it('should display doctors on input change', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByText, getByLabelText} = render(<FindDoctor />);
    var input = getByLabelText('Doktor');
    fireEvent.change(input, {target : {value: "A"}});
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var doctorLabel = getByText('Anna Annowska');
  });

  it('should display doctor working hours on click on doctor', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByText, getByLabelText} = render(<FindDoctor />);
    var input = getByLabelText('Doktor');
    fireEvent.change(input, {target : {value: "A"}});
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var doctorLabel = getByText('Anna Annowska');
    var doctorBtn = getByRole('button');
    fireEvent.click(doctorBtn);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var info = getByText('Lokale i godziny pracy lekarza');

  });

});

describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display error message when unable fetch data', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    const {debug, getByRole, getByText, getByLabelText} = render(<FindDoctor />);
    var input = getByLabelText('Doktor');
    fireEvent.change(input, {target : {value: "A"}});
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
