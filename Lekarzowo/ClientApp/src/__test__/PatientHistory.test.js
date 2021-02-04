import PatientHistory from '../PatientHistory.js';
import {shallow, mount, debug} from 'enzyme';
import {act, render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';
import MockBackend from '../__mocks__/MockBackend.js.js';



it('renders', () => {
  global.window = Object.create(window);
  const url = "/patientHistoryMore/5?visit=12";
  Object.defineProperty(window, 'location', {
    value: {
      href: url
    }
  });
  shallow(<PatientHistory  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display sickness list', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
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
    const {debug, getByRole, getByText} = render(<PatientHistory />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var info = getByText('Ból głowy');
    var btn = getByText('Choroba zakończona');

  });

  it('should display medicine list', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
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
    const {debug, getByRole, getByText} = render(<PatientHistory />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var info = getByText('Apap');
  });

  it('should be able to fill inputs', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
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
    const {debug, getAllByRole, getByText, getByLabelText} = render(<PatientHistory />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    //debug(null, 30000);
    var inputs = getAllByRole('textbox',  {name: 'Opis'});
    fireEvent.change(inputs[0], {target: {value: 'Opis leku'}})
    expect(inputs[0].value).toEqual('Opis leku');
    fireEvent.change(inputs[1], {target: {value: 'Opis choroby'}})
    expect(inputs[1].value).toEqual('Opis choroby');

  });

  it('should display information on when input errors occur', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
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
    const {debug, getAllByText, getByRole, getByLabelText} = render(<PatientHistory />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var btns = getAllByText('Dodaj');
    fireEvent.click(btns[0]);
    await  wait(() => alert = getByRole('alert'));
    expect(alert.className).toContain('show');
    expect(alert.className).toContain('red-snackbar');
    fireEvent.click(btns[1]);
    await  wait(() => alert = getByRole('alert'));
    expect(alert.className).toContain('show');
    expect(alert.className).toContain('red-snackbar');
  });

  it('should be able to finish medicine', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
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
    const {debug, getByText, getByRole, getByLabelText} = render(<PatientHistory />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var btn = getByText('Choroba zakończona');
    fireEvent.click(btn);
    await wait(() => alert = getByRole('alert'));
  });

  it('should be able to finish medicine', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
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
    const {debug, getByText, getByRole, getByLabelText} = render(<PatientHistory />);
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(2));
    var btn = getByText('Pacjent nie przyjmuje');
    fireEvent.click(btn);
    await wait(() => alert = getByRole('alert'));
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
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
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
    const {debug, getByText, getByRole, getByLabelText} = render(<PatientHistory />);
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');
    expect(alert.classList).toContain('red-snackbar');
  });

});
