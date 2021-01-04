import VisitAlert from '../../components/VisitAlert.js';
import {shallow, mount, debug} from 'enzyme';
import {render, fireEvent, wait, cleanup} from '@testing-library/react';
import React from 'react';


it('renders', () => {
  shallow(<VisitAlert />);
});

describe("Component functionality", () => {

  afterEach(() => {
    jest.clearAllMocks();
    cleanup;
  });

  it('should hide when there is no  open visit', () => {
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return null
    });
    const {debug, getByText} = render(<VisitAlert />);
    expect(spyGetItem).toHaveBeenCalledTimes(1);
    var parentDiv =  getByText('Masz otwartą wizytę').parentNode.classList;
    expect(parentDiv).toContain('visible-none');
  });

  it('should check locally if there is an open visit', () => {
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":1,
      "startDate": new Date()
    })
    });
    const {debug} = render(<VisitAlert />);
    expect(spyGetItem).toHaveBeenCalledTimes(1);
  });

  it('should fetch (ok) and redirect on clicked button ', async () => {
    const spyGlobalFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 200,
      ok: true,
      json: () => Promise.resolve({
        "value": true
      })
    }));
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":1,
      "startDate": new Date()
    })
    });
    const {debug, getByText} = render(<VisitAlert history = {historyMock}/>);
    //debug();
    var btn = getByText('Kliknij tu aby powrócic');
    fireEvent.click(btn);
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(spyGetItem).toHaveBeenCalledTimes(4);
    expect(historyMock.push).toHaveBeenCalledTimes(1);
    expect(historyMock.push.mock.calls[0][0]).toEqual('/visit/1');
    expect(spyGetItem.mock.calls[0][0]).toEqual('activeVisit');
    expect(spyGetItem.mock.calls[3][0]).toEqual('activeVisit');
  });

  it('should fetch (error) and not redirect on clicked button', async() => {
    const spyGlobalFetch = jest.spyOn(global, 'fetch')
    .mockImplementation(() => Promise.resolve({
      status: 404,
      ok: false
    }));
    const historyMock = { push: jest.fn((path) => {
      return path
    }) };
    var spyGetItem = jest.spyOn(Storage.prototype, 'getItem')
    .mockImplementation((key) => {return JSON.stringify(
      {"id":1,
      "startDate": new Date()
    })
    });
    const {debug, getByText} = render(<VisitAlert history = {historyMock}/>);
    //debug();
    var btn = getByText('Kliknij tu aby powrócic');
    fireEvent.click(btn);
    await wait(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(spyGetItem).toHaveBeenCalledTimes(3);
    expect(historyMock.push).toHaveBeenCalledTimes(0);
    expect(spyGetItem.mock.calls[0][0]).toEqual('activeVisit');
  });

});
