import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/RegisterTeacher.css';

const RegisterTeacher = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        matricula: '',
        concursado: '',
        address: '',
        phone: '',
        email: '',
        specialization: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCPFChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        const formattedCPF = rawValue
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
        setFormData({
            ...formData,
            cpf: formattedCPF,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Remove formatação do CPF antes de enviar
        const formDataToSend = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ''), // Remove os pontos e traços
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teachers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao cadastrar o professor.');
            }

            setSuccess('Professor cadastrado com sucesso!');
            setFormData({
                name: '',
                cpf: '',
                matricula: '',
                concursado: '',
                address: '',
                phone: '',
                email: '',
                specialization: '',
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="register-teacher">
            <Header toggleSidebar={toggleSidebar} />
            <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                <Sidebar isOpen={isSidebarOpen} />
                <main className="content">
                    <div className="form-container">
                        <h2>Cadastro de Professor</h2>
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                        <form className="teacher-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nome</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleCPFChange}
                                    maxLength={14}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Matrícula</label>
                                <input
                                    type="text"
                                    name="matricula"
                                    value={formData.matricula}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Concursado</label>
                                <div className="radio-group">
                                    <label>
                                        <input
                                            type="radio"
                                            name="concursado"
                                            value={true}
                                            onChange={() => handleChange({ target: { name: 'concursado', value: true } })}
                                            checked={formData.concursado === true}
                                            required
                                        />{' '}
                                        Sim
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="concursado"
                                            value={false}
                                            onChange={() => handleChange({ target: { name: 'concursado', value: false } })}
                                            checked={formData.concursado === false}
                                            required
                                        />{' '}
                                        Não
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Endereço</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Telefone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Especialização</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="button">
                                Cadastrar
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RegisterTeacher;
