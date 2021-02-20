import AddVisit from '../AddVisit.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  const spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
  .mockImplementation((key) => {return JSON.stringify(
    {"id":141,
    "firstName":"Andrzej",
    "lastName":"Andrzejewski",
    "email":"a@a.a",
    "roles":["patient","doctor","admin"],
    "token":"zsdscdsw"
    ,"currentRole":"doctor"
  })
  });
  render(<AddVisit  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display validation errorrs when inputs are blank', async () => {
    const {debug, getByRole, getByText} = render(<AddVisit  />);
    //debug();
    var searchBtn = getByRole('button', {name: 'Szukaj'});
    fireEvent.click(searchBtn);
    var alert;
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
  });

  it('should be able to fill the form', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getAllByRole, getByLabelText, getByRole, getByTestId} = render(<AddVisit  />)
    var comboBoxInput = getByTestId('autocomplete-cities');
    var inputCity = getByLabelText('Miasto');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "W" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Warszawa');
    var comboBoxSpec = getByTestId('autocomplete-speciality');
    var inputSpec = getByLabelText('Specjalizacja');
    comboBoxSpec.focus();
    fireEvent.change(inputSpec, { target: { value: "K" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled());
    fireEvent.keyDown(comboBoxSpec, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxSpec, { key: 'Enter' });
    await wait();
    expect(inputSpec.value).toEqual('Kardiologia');
    var comboBoxDoctor = getByTestId('autocomplete-doctor');
    var inputDoctor = getByLabelText('Doktor');
    comboBoxDoctor.focus();
    fireEvent.change(inputDoctor, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled());
    fireEvent.keyDown(comboBoxDoctor, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxDoctor, { key: 'Enter' });
    await wait();
    expect(inputDoctor.value).toEqual('Anna Annowska');
    var searchBtn = getByRole('button', {name: 'Szukaj'});
    fireEvent.click(searchBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).not.toContain('show');
  });

});


describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display message when there is a problem woth fetching data', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getAllByRole, getByLabelText, getByRole, getByTestId} = render(<AddVisit  />)
    var comboBoxInput = getByTestId('autocomplete-cities');
    var inputCity = getByLabelText('Miasto');
    comboBoxInput.focus();
    fireEvent.change(inputCity, { target: { value: "W" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled())
    fireEvent.keyDown(comboBoxInput, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxInput, { key: 'Enter' });
    await wait();
    expect(inputCity.value).toEqual('Warszawa');
    var comboBoxSpec = getByTestId('autocomplete-speciality');
    var inputSpec = getByLabelText('Specjalizacja');
    comboBoxSpec.focus();
    fireEvent.change(inputSpec, { target: { value: "K" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled());
    fireEvent.keyDown(comboBoxSpec, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxSpec, { key: 'Enter' });
    await wait();
    expect(inputSpec.value).toEqual('Kardiologia');
    var comboBoxDoctor = getByTestId('autocomplete-doctor');
    var inputDoctor = getByLabelText('Doktor');
    comboBoxDoctor.focus();
    fireEvent.change(inputDoctor, { target: { value: "A" }});
    await wait(() => expect(spyGlobalFetch).toHaveBeenCalled());
    fireEvent.keyDown(comboBoxDoctor, { key: 'ArrowDown' });
    await wait();
    fireEvent.keyDown(comboBoxDoctor, { key: 'Enter' });
    await wait();
    expect(inputDoctor.value).toEqual('Anna Annowska');

    jest.clearAllMocks();
    const spyGlobalFetchEror = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    var searchBtn = getByRole('button', {name: 'Szukaj'});
    fireEvent.click(searchBtn);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
  });

});
