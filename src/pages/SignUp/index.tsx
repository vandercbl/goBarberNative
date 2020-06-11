import React, { useRef, useCallback } from 'react'
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
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import api from '../../services/api'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png'

import { Container, Title, BackToSignIn, BackToSignInText } from './styles'

interface SignUpFormData {
	name: string
	email: string
	password: string
}

const SignUp: React.FC = () => {
	const formRef = useRef<FormHandles>(null)
	const navigation = useNavigation()

	const emailInputRef = useRef<TextInput>(null)
	const passwordInputRef = useRef<TextInput>(null)

	const handleSignUp = useCallback(
		async (data: SignUpFormData) => {
			try {
				formRef.current?.setErrors({}) // sempre que entrar na função zera os erros de validação

				// schema vamos validar um objeto que tem o seguinte formato
				// ferramenta parecida com os plugins de validate do jquery
				const schema = Yup.object().shape({
					name: Yup.string().required('Nome obrigatório'),
					email: Yup.string()
						.required('E-mail obrigatório')
						.email('Digite um e-mail válido'),
					password: Yup.string().min(6, 'No mínimo 6 dígitos'),
				})
				await schema.validate(data, {
					abortEarly: false, // vai retornar todos os erros de uma vez só e não só o primeiro que ele encontrar
				})

				await api.post('/users', data)
				Alert.alert(
					'Cadastro realizado com sucesso!',
					'Você já pode fazer login na aplicação.',
				)
				navigation.goBack()
			} catch (err) {
				// estamos verificando se é algum erro de validação do yup
				if (err instanceof Yup.ValidationError) {
					const errors = getValidationErrors(err)
					formRef.current?.setErrors(errors)
					return
				}
				Alert.alert(
					'Erro no cadastro',
					'Ocorreu um erro ao fazer cadastro, tente novamente',
				)
			}
		},
		[navigation],
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
							<Title>Crie sua conta</Title>
						</View>
						<Form ref={formRef} onSubmit={handleSignUp}>
							<Input
								autoCapitalize="words" // maiuscula para a primelira letra de cada palavra
								name="name"
								icon="user"
								placeholder="Nome"
								returnKeyType="next" // para através do botão next do teclado, ir para o próximo campo
								onSubmitEditing={() => {
									emailInputRef.current?.focus()
								}}
							/>
							<Input
								ref={emailInputRef}
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
								secureTextEntry // tipo password
								textContentType="newPassword" // força uma nova senha, para o sistema não sugerir uma senha
								name="password"
								icon="lock"
								placeholder="Senha"
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
					</Container>
				</ScrollView>
			</KeyboardAvoidingView>
			<BackToSignIn
				onPress={() => {
					navigation.goBack()
				}}
			>
				<Icon name="arrow-left" size={20} color="#fff" />
				<BackToSignInText>Voltar para logon</BackToSignInText>
			</BackToSignIn>
		</>
	)
}

export default SignUp
