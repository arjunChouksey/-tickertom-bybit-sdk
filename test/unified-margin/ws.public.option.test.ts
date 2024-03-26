/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WSClientConfigurableOptions,
  WS_KEY_MAP,
  WebsocketClient,
} from '../../src';
import {
  WS_OPEN_EVENT_PARTIAL,
  getSilentLogger,
  logAllEvents,
  waitForSocketEvent,
} from '../ws.util';

describe('Public Unified Margin Websocket Client (Options)', () => {
  let wsClient: WebsocketClient;

  const wsClientOptions: WSClientConfigurableOptions = {
    market: 'unifiedOption',
  };

  beforeAll(() => {
    wsClient = new WebsocketClient(
      wsClientOptions,
      getSilentLogger('expectSuccessNoAuth')
    );
    wsClient.connectPublic();
  });

  afterAll(() => {
    wsClient.closeAll(true);
  });

  it('should open a public ws connection', async () => {
    const wsOpenPromise = waitForSocketEvent(wsClient, 'open');
    try {
      expect(await wsOpenPromise).toMatchObject({
        event: WS_OPEN_EVENT_PARTIAL,
        wsKey: WS_KEY_MAP.unifiedOptionPublic,
      });
    } catch (e) {
      expect(e).toBeFalsy();
    }
  });

  it('should subscribe to public orderbook events', async () => {
    const wsResponsePromise = waitForSocketEvent(wsClient, 'response');
    // const wsUpdatePromise = waitForSocketEvent(wsClient, 'update');

    wsClient.subscribe('orderbook.25.BTCUSDT');

    try {
      expect(await wsResponsePromise).toMatchObject({
        success: true,
        type: 'COMMAND_RESP',
      });
    } catch (e) {
      // sub failed
      expect(e).toBeFalsy();
    }

    // try {
    //   expect(await wsUpdatePromise).toStrictEqual('asdfasdf');
    // } catch (e) {
    //   // no data
    //   expect(e).toBeFalsy();
    // }
  });
});
