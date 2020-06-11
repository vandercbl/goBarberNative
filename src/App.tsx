import 'react-native-gesture-handler'
// no site https://reactnavigation.org/docs/getting-started/ ele diz para colocarmos esse código sendo a primeira linha de código da nossa aplicação, lembrando que utilizamos essa bibliateca para fazer as navegação das rotas.

import React from 'react'
import { View, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native' // na documentação diz que esse componente tem que estar envolvendo toda a aplicação

import AppProvider from './hooks'

import Routes from './routes'

const App: React.FC = () => (
	<NavigationContainer>
		<StatusBar barStyle="light-content" backgroundColor="#312e38" />
		<AppProvider>
			<View style={{ flex: 1, backgroundColor: '#312e38' }}>
				<Routes />
			</View>
		</AppProvider>
	</NavigationContainer>
)

export default App
