import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockApi } from "../services/mockApi";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import toast from "react-hot-toast";

export const Register = ()=>{
    const [userType, setUserType] =useState('paciente')
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:'',
        CRP:'',
        speciality:'',
        Phone:'',
        bithDate:''
    })

    const [loading, setLoading] =useState(false)
    const{login} = useAuth();
    const navigate = useNavigate();

    const handleInputChange = useCallback ((field) => (e)=>{
    setFormData(prev => ({...prev, [field]: e.target.value}))
})
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(formData.password !== formData.confirmPassword){
            toast.error('Senhas não coincidem');
            return;  
        }
        setLoading(true);
        try {
            const {user, token } = await mockApi.register({
                ...formData,
                type:userType
            });
            login(user, token)
            toast.success('Conta criada com sucesso');
            navigate('/dashboard')
        } catch (error) {
           toast.error(error.message)
        }finally{
            setLoaing(false);
        }
    }

    return(
        <div className="min-h-[calc(100vh-80px) flex items-center justify-center p-9">
            <Card className="bg-amber-400 w-full max-w-md ">
                <div className="text-center mb-4">
                  <h1 className="text-3xl font-bold text-dark mb-2">Criar conta</h1>
                  <p className="text-dark/50">Cadastre-se no PsiLua</p>
                </div>
                {/*seletor de usuario*/}
                <div className="flex mb-9 gap-9 items-center justify-center">
                    <Button
                    type= "Button"
                    variant= {userType === 'paciente' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick = {() => setUserType('paciente')}
                    className= "flex"
                    >Paciente</Button>

                    <Button
                     type= "Button"
                     variant= {userType === 'psicologo' ? 'primary' : 'secondary'}
                     size="sm"
                     onClick = {() => setUserType('psicologo')}
                     className= "flex"
                    >Psicólogo</Button>

                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome Completo"
                        value= {formData.name}
                        onChange= {handleInputChange ('name')}
                        placeholder = "Seu nome completo"
                        required
                    />
                    <Input
                        label="E-mail"
                        type= "email"
                        value= {formData.email}
                        onChange= {handleInputChange ('email')}
                        placeholder = "seu@email.com"
                        required
                    />
                     <Input
                        label="Senha"
                        type="password"
                        value= {formData.password}
                        onChange= {handleInputChange ('name')}
                        placeholder = "Sua senha"
                        required
                    />
                    <Input
                        label="Confirme sua senha"
                        type= "password"
                        value= {formData.password}
                        onChange= {handleInputChange ('confirmPassword')}
                        placeholder = "confirme sua senha"
                        required
                    />
                    <Input
                        label="Telefone"
                        type= "tel"
                        value= {formData.Phone}
                        onChange= {handleInputChange ('phone')}
                        placeholder = "digite seu telefone"
                        required
                    />
                    {userType === "paciente" &&(
                        <>
                        <Input
                         label="Data de nascimento"
                         type= "date"
                         value= {formData.birthDate}
                         onChange= {handleInputChange ('birthDate')}
                         placeholder = "Digite sua data de nascimento"
                         required
                    />
                </>
                 )}
                 {userType ==="psicologo" &&(
            <>
                <Input
                     label="CRP"
                     type= "date"
                     value= {formData.CRP}
                     onChange= {handleInputChange ('CRP')}
                     placeholder = "Ex: 12/34567"
                     required
                />
                <Input
                     label="Especialidade"
                     value= {formData.speciality}
                     onChange= {handleInputChange ('speciality')}
                     placeholder = "Psicologia Clínia, Terapia Cognitiva"
                     required
                />


            </>
            )}
            <Button
                type="Submit"
                loading={loading}
                className="w-full"
                />
                </form>
                <div className="m-6 text-center space-y-2">
                    <p className="text-dark/70">
                        Já tem uma conta?
                    </p>
                    <Link to= "/login" className="text-black/75 font-bold hover:text-dark">
                        Fazer login
                    </Link>
                </div>
            </Card>
        </div>
    )
}