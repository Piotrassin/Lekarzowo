import VisitDetails from '../VisitDetails.js';
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
  render(<VisitDetails  />);
});

describe('site functionality for the upcoming visit', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display button for starting a visit when a visit doesnt exist in system', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    global.window = Object.create(window);
    const url = "/visit/5";
    Object.defineProperty(window, 'location', {
      value: {
        href: url
      }
    });
    const {debug, getByText, getByLabelText, getByRole, getByTestId} = render(<VisitDetails  />)
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(3));
    debug();
    await wait(() => getByText('Rozpocznij wizytę'));
  });

  it('should not display button for starting a visit when a visit exist in system', async () => {
    jest.clearAllMocks();
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const url = "/visit/6";
    delete window.location;
    Object.defineProperty(window, 'location', {
      value: {
        href: url
      }
    });
    const {debug, queryByText, getByLabelText, getByRole, getByTestId} = render(<VisitDetails  />)
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(3));
    var button = queryByText('Rozpocznij wizytę');
    expect(button).toBeNull();
  });

});

describe('site functionality for the past visit', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display visit details', async () => {
    
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
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
    const {debug, getByText, getByLabelText, getByRole, getByTestId} = render(<VisitDetails  />)
    await wait(expect(spyGlobalFetch).toHaveBeenCalledTimes(3));
    await wait(() => getByText('Rentgen'));
    await wait(() => getByText('Przeprowadzono'));
    await wait(() => getByText('Zdiagnozowano'));
  });

});


describe('site functionality with fetch status 500', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display message when there is a problem woth fetching data', async () => {
    jest.clearAllMocks();
    const spyGlobalFetchEror = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetchWithError(url, options));
    });
    const {debug, getAllByRole, getByLabelText, getByRole, getByTestId} = render(<VisitDetails  />)
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');

  });

});
