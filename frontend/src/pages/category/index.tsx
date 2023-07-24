import { useState, FormEvent } from 'react'
import Head from "next/head"
import {Header} from '../../components/Header'
import styles from './styles.module.scss'
import { parseCookies } from 'nookies'

import { setupAPIClient } from '../../services/api' 
import { toast } from 'react-toastify'

import { canSSRAuth } from '../../utils/canSSRAuth'

type CategoryProps = {
    id: string;
    name: string;
}

interface CategoryListProps{
    categoriesList: CategoryProps[];

}

export default function Category({categoriesList}: CategoryListProps){
    const [name, setName] = useState('')

    const { '@nextauth.token': token } = parseCookies();

    const [categories, setCategories] = useState(categoriesList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    async function handleRegister(event: FormEvent){
        event.preventDefault();

        if(name === ''){
            return;
        }

        const apiCliente = setupAPIClient();
        await apiCliente.post('/category',{
            name: name
        })

        toast.success('Categoria cadastrada com sucesso!')
        setName('');

    }

    function handleChangeCategory(event){

        setCategorySelected(event.target.value)

    }

    async function handleDelete(event: FormEvent) {
        event.preventDefault();

        const category_id = categories[categorySelected].id

        //console.log(token)

        const api = setupAPIClient ()


        await api.delete (`/category?category_id=${category_id}`)
        .then( () => { window.location.href = "/category" } )
        .catch(() => console.log('erro'))


        
        
    }

    

    return(
        <>
        <Head>
            <title>Nova categoria - Leancxt Pizzaria</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>Cadastrar Categoria</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <input
                    type="text"
                    placeholder="Digite o nome da categoria"
                    className={styles.input}
                    value={name}
                    onChange={ (e) => setName(e.target.value) }
                    />

                    <button className={styles.buttonAdd} type="submit">
                        Cadastrar Categoria
                    </button>

                </form>

                <h1>Deletar Categoria</h1>
                    <form className={styles.form} onSubmit={handleDelete}>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map( (category, index)  => {
                                return(
                                    <option key={category.id} value={index}>
                                        {category.name}
                                    </option>
                                )

                            })}
                        </select>

                        <button className={styles.buttonDelete} type="submit">
                            Deletar Categoria
                        </button>   

                    </form>

                

            </main>
        </div>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) =>{
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category');

    return {
        props:{
            categoriesList: response.data
        }
    }

})