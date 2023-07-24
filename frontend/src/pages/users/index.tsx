import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '../../components/Header'
import { useState, ChangeEvent, FormEvent, useContext } from 'react'
import { parseCookies } from 'nookies'

import { canSSRAuth } from '../../utils/canSSRAuth'

import { setupAPIClient } from '../../services/api'



type UserProps = {
    id: string;
    name: string;
    email: string;
}

interface UserListProps{
    usersList: UserProps[];

}

export default function Users({ usersList }: UserListProps){

    const { '@nextauth.token': token } = parseCookies();
    const [users, setUsers] = useState(usersList || [])
    const [userSelected, setUserSelected] = useState(0)


    function handleChangeUser(event){

        setUserSelected(event.target.value)

    }

    async function handleDelete(event: FormEvent) {
        event.preventDefault();

        const user_id = users[userSelected].id

        //console.log(token)

        const api = setupAPIClient ()


        await api.delete (`/users?user_id=${user_id}`)
        .then( () => { window.location.href = "/users" } )
        .catch(() => console.log('erro'))


        
        
    }

    return (
        <>
            <Head>
                <title>Controle de usuarios</title>
            </Head>
            <div>
                <Header/>

                <main className={styles.container}>

                    <h1></h1>
                    <form className={styles.form} onSubmit={handleDelete}>

                        <select value={userSelected} onChange={handleChangeUser}>
                            {users.map( (user, index)  => {
                                return(
                                    <option key={user.id} value={index}>
                                        {user.email}
                                    </option>
                                )

                            })}
                        </select>

                        <button className={styles.buttonDelete} type="submit">
                            Deletar Usuario
                        </button>   

                    </form>



                </main>


            </div>
            
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) =>{
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/users');

    //console.log(response.data);

    return{
        props:{
            usersList: response.data
        }
    }
})