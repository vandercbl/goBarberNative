import React, { useCallback, useRef } from 'react'
import {
	Image,
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TextInput,
	Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import * as Yup from 'yup'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
// lib de form da rocketseat

import { useAuth } from '../../hooks/auth'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'

import {
	Container,
	Title,
	ForgotPassword,
	ForgotPasswordText,
	CreateAccountButton,
	CreateAccountButtonText,
} from './styles'

interface SignInFormatData {
	email: string
	paassword: string
}

const SignIn: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const passwordInputRef = useRef<TextInput>(null)
	const navigation = useNavigation()
	// para poder navegar através das rotas

	const { signIn } = useAuth()

	const handleSignIn = useCallback(
		async (data: SignInFormatData) => {
			try {
				formRef.current?.setErrors({}) // sempre que entrar na função zera os erros de validação

				// schema vamos validar um objeto que tem o seguinte formato
				// ferramenta parecida com os plugins de validate do jquery
				const schema = Yup.object().shape({
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					password: Yup.string().required('Senha obrigatória'),
				})
				await schema.validate(data, {
					abortEarly: false, // vai retornar todos os erros de uma vez só e não só o primeiro que ele encontrar
				})

				await signIn({
					email: data.email,
					password: data.password,
				})
			} catch (err) {
				// estamos verificando se é algum erro de validação do yup
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationErrors(err)
					formRef.current?.setErrors(errors)
					return
				}

				Alert.alert(
					'Erro na autenticação',
					'Ocorreu um erro ao fazer login, cheque as credenciais.',
				)
			}
		},
		[signIn],
	)

	return (
		<>
			{/* KeyboardAvoidingView  para evitar do teclado do dispositivo ficar por cima da aplicação, sendo assim quando clicar no input, tudo sobe para ter espaço para o teclado */}
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				enabled
			>
				{/* ScrollView para ficar com barra de rolagem caso a tela seja pequena para o conteúdo */}
				<ScrollView
					// keyboardShouldPersistTaps handled - é para ter o comportamento de cada plataforma padrão caso a pessoa clique fora do teclado ocultar
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ flex: 1 }}
				>
					<Container>
						<Image source={logoImg} />
						{/* colocamos a view por volta do texto para poder fazer a animação corretamente do texto de acordo com o movimento do teclado */}
						<View>
							<Title>Faça seu logon</Title>
						</View>

						<Form ref={formRef} onSubmit={handleSignIn}>
							<Input
								autoCorrect={false} // para não exibir opção de auto correção no teclado
								autoCapitalize="none" // para ficar tudo caixa baixa por default
								keyboardType="email-address" // campo tipo email, parecido como no html
								name="email"
								icon="mail"
								placeholder="E-mail"
								returnKeyType="next" // para através do botão next do teclado, ir para o próximo campo
								onSubmitEditing={() => {
									passwordInputRef.current?.focus()
								}}
							/>
							<Input
								ref={passwordInputRef}
								name="password"
								icon="lock"
								placeholder="Senha"
								secureTextEntry // tipo password
								returnKeyType="send" // botão de enviar diferenciado pelo teclado
								onSubmitEditing={() => {
									// ação de quando a pessoa clicar no botão de sendo do teclado
									formRef.current?.submitForm()
								}}
							/>
							<Button
								onPress={() => {
									formRef.current?.submitForm()
								}}
							>
								Entrar
							</Button>
						</Form>

						<ForgotPassword onPress={() => {}}>
							<ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
						</ForgotPassword>
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
			<CreateAccountButton
				onPress={() => {
					navigation.navigate('SignUp')
				}}
			>
				<Icon name="log-in" size={20} color="#ff9000" />
				<CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
			</CreateAccountButton>
		</>
	)
}

export default SignIn
