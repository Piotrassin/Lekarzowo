import AdminAddSpeciality from '../AdminAddSpeciality.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  shallow(<AdminAddSpeciality  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display validation erros when inputs are not filled in', async () => {
    const {debug, getByText, getByRole} = render(<AdminAddSpeciality />);
    var btn = getByText('Dodaj');
    fireEvent.click(btn)
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });


  it('should be able to fill inputs', () => {
    const {debug, getByRole, getByLabelText} = render(<AdminAddSpeciality />);
    var input = getByRole('textbox', {name: 'Nazwa specializacji'});
    fireEvent.change(input, {target : {value: "Kardiologia"}});
    expect(input.value).toEqual('Kardiologia');
    var input = getByRole('spinbutton', {name: 'Cena bazowa za wizytę'});
    fireEvent.change(input, {target : {value: 100}});
    expect(input.value).toEqual('100');
    var inputNumber = getByLabelText('Docelowy czas wizyty');
    fireEvent.change(inputNumber, {target : {value: 120}});
    expect(inputNumber.value).toEqual('120');
  });

  it('should display message when succesfuly added sickness', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByRole, getByText, getByLabelText} = render(<AdminAddSpeciality />);
    var input = getByRole('textbox', {name: 'Nazwa specializacji'});
    fireEvent.change(input, {target : {value: "Kardiologia"}});
    expect(input.value).toEqual('Kardiologia');
    var input = getByRole('spinbutton', {name: 'Cena bazowa za wizytę'});
    fireEvent.change(input, {target : {value: 100}});
    expect(input.value).toEqual('100');
    var inputNumber = getByLabelText('Docelowy czas wizyty');
    fireEvent.change(inputNumber, {target : {value: 120}});
    expect(inputNumber.value).toEqual('120');
    var btn = getByText('Dodaj');
    fireEvent.click(btn);
    expect(spyGlobalFetch).toHaveBeenCalled();
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('green-snackbar');
  })

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
    const {debug, getByRole, getByText, getByLabelText} = render(<AdminAddSpeciality />);
    var input = getByRole('textbox', {name: 'Nazwa specializacji'});
    fireEvent.change(input, {target : {value: "Kardiologia"}});
    expect(input.value).toEqual('Kardiologia');
    var input = getByRole('spinbutton', {name: 'Cena bazowa za wizytę'});
    fireEvent.change(input, {target : {value: 100}});
    expect(input.value).toEqual('100');
    var inputNumber = getByLabelText('Docelowy czas wizyty');
    fireEvent.change(inputNumber, {target : {value: 120}});
    expect(inputNumber.value).toEqual('120');
    var btn = getByText('Dodaj');
    fireEvent.click(btn);
    expect(spyGlobalFetch).toHaveBeenCalled();
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
