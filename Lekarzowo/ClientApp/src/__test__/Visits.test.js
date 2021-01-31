import Visits from '../Visits.js';
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
  render(<Visits  />);
});

describe('site functionality with fetch status 200', () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should display upcoming visits', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByText, getByLabelText, getByRole, getByTestId} = render(<Visits  />)
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var showButton = getByText('Zobacz');
  });

  it('should display previous visits', async () => {
    const spyGlobalFetch = jest.spyOn(window, 'fetch')
    .mockImplementation((url, options) => {
      return Promise.resolve(MockBackend.mockFetch(url, options));
    });
    const {debug, getByText, getByLabelText, getByRole, getByTestId} = render(<Visits  />)
    var switchBtn = getByRole('checkbox');
    fireEvent.click(switchBtn);
    await wait(expect(spyGlobalFetch).toHaveBeenCalled());
    var showButton = getByText('Zobacz');
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
    const {debug, getAllByRole, getByLabelText, getByRole, getByTestId} = render(<Visits  />)
    await wait(() => alert = getByRole('alert'));
    expect(alert.classList).toContain('show');

  });

});
