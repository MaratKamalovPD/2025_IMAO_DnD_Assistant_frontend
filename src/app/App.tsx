import { AppRouter } from './routes';

import { MainProviders } from './providers';
import 'app/styles/global.scss';

function App() {
  return (
    <MainProviders>
      <AppRouter />
    </MainProviders>
  );
}

export default App;
