import { BaseModule } from '..';
import { TRXStateProvider } from './api/csp';
import { TrxRoutes } from './api/trx-routes';
import { TrxVerificationPeer } from './p2p/TrxVerificationPeer';
import { TrxP2pWorker } from './p2p/p2p';

export default class TRXModule extends BaseModule {
  constructor(services: BaseModule['bitcoreServices']) {
    super(services);
    services.P2P.register('TRX', TrxP2pWorker);
    services.CSP.registerService('TRX', new TRXStateProvider());
    services.Api.app.use(TrxRoutes);
    services.Verification.register('TRX', TrxVerificationPeer);
  }
}
