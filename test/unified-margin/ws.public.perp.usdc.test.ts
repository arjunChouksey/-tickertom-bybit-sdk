/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WSClientConfigurableOptions,
  WS_KEY_MAP,
  WebsocketClient,
} from '../../src';
import {
  WS_OPEN_EVENT_PARTIAL,
  fullLogger,
  getSilentLogger,
  logAllEvents,
  waitForSocketEvent,
} from '../ws.util';

describe('Public Unified Margin Websocket Client (Perps - USDC)', () => {
  let wsClient: WebsocketClient;

  const wsClientOptions: WSClientConfigurableOptions = {
    market: 'unifiedPerp',
  };

  beforeAll(() => {
    wsClient = new WebsocketClient(
      wsClientOptions,
      getSilentLogger('expectSuccessNoAuth')
      // fullLogger
    );
    // logAllEvents(wsClient);
    wsClient.connectPublic();
  });

  it('should open a public ws connection', async () => {
    const wsOpenPromise = waitForSocketEvent(wsClient, 'open');
    try {
      expect(await wsOpenPromise).toMatchObject({
        event: WS_OPEN_EVENT_PARTIAL,
        wsKey: expect.stringContaining('unifiedPerpUSD'),
      });
    } catch (e) {
      expect(e).toBeFalsy();
    }

    wsClient.closeAll(true);
  });

  // TODO: are there USDC topics? This doesn't seem to work
  it.skip('should subscribe to public orderbook events through USDC connection', async () => {
    const wsResponsePromise = waitForSocketEvent(wsClient, 'response');
    const wsUpdatePromise = waitForSocketEvent(wsClient, 'update');

    // USDT should be detected and automatically routed through the USDT connection
    wsClient.subscribe('orderbook.25.BTCUSDC');

    try {
      expect(await wsResponsePromise).toMatchObject({
        op: 'subscribe',
        req_id: 'orderbook.25.BTCUSDC',
        success: true,
        wsKey: WS_KEY_MAP.unifiedPerpUSDTPublic,
      });
    } catch (e) {
      // sub failed
      expect(e).toBeFalsy();
    }

    try {
      expect(await wsUpdatePromise).toMatchObject({
        data: {
          a: expect.any(Array),
          b: expect.any(Array),
          s: 'BTCUSDT',
          u: expect.any(Number),
        },
        wsKey: WS_KEY_MAP.unifiedPerpUSDTPublic,
        topic: 'orderbook.25.BTCUSDC',
        ts: expect.any(Number),
        type: 'snapshot',
      });
    } catch (e) {
      console.error('unified margin perp ws public error: ', e);

      // no data
      expect(e).toBeFalsy();
    }
  });
});
