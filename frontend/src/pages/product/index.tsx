import { useState, ChangeEvent, FormEvent } from 'react'
import Head from 'next/head';
import styles from './styles.module.scss'
import { Header } from '../../components/Header'

import { canSSRAuth } from '../../utils/canSSRAuth'

import { FiUpload } from 'react-icons/fi'

import { setupAPIClient } from '../../services/api'

import { toast } from 'react-toastify'

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps{
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps){

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');


    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);

    const [categories, setCategories] = useState(categoryList || [])
    const [categorySelected, setCategorySelected] = useState(0)

    /*
    const [products, setProducts] = useState(productList || [])
    const [productSelected, setProductSelected] = useState(0)
    */

    function handleFile(event: ChangeEvent<HTMLInputElement>){
        
        if(!event.target.files){
            return;
        }

        const image = event.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){

            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(event.target.files[0]))
        }
    }

    //Quando voce seleciona uma nova categoria na lista
    function handleChangeCategory(event){
        //console.log("Posicao da categoria selecionada", event.target.value)
        //console.log('Categoria selecionada', categories[event.target.value])

        setCategorySelected(event.target.value)
    }

    /*
    function handleChangeProduct(event){
        

        setProductSelected(event.target.value)
    }

    */

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        try{
          const data = new FormData();

          if(name === '' || price === '' || description === '' || imageAvatar === null){
            toast.error("Preencha todos os campos!")
            return;
          }

          data.append('name', name);
          data.append('price', price);
          data.append('description', description);
          data.append('category_id', categories[categorySelected].id );
          data.append('file', imageAvatar);

          const apiClient = setupAPIClient();

          await apiClient.post('/product', data)

          toast.success('Cadastrado com sucesso!')

        }catch(err){
            console.log(err);
            toast.error("Ops erro ao cadastrar!")
        }


        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar('');
        setAvatarUrl('');
        
    }

    /*

    async function handleDelete(event: FormEvent) {
        event.preventDefault();

        const product_id = products[productSelected].id

        //console.log(token)

        const api = setupAPIClient ()


        await api.delete (`/product?product_id=${product_id}`)
        .then( () => { window.location.href = "/product" } )
        .catch(() => console.log('erro'))


        
        
    }

    */

    return(
        <>
            <Head>
                <title>Novo Produto - Leancxt Pizzaria</title>
            </Head>
            <div>
                <Header/>

                <main className={styles.container}>
                    <h1>Novo Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>

                    <label className={styles.labelAvatar}>
                        <span>
                            <FiUpload size={30} color="#fff"/>
                        </span>

                        <input type="file" accept="image/png, image/jpeg" onChange={handleFile}/>

                       {avatarUrl && (
                            <img
                                className={styles.preview}
                                src={avatarUrl}
                                alt="Foto do produto" 
                                width={250}
                                height={250}
                            />
                       )}

                    </label>


                    <select value={categorySelected} onChange={handleChangeCategory}>
                       {categories.map( (item, index) => {
                            return(
                                <option key={item.id} value={index}>
                                 {item.name}
                                </option>
                            ) 
                        })}
                    </select>

                    <input
                    type="text"
                    placeholder="Digite o nome do produto"
                    className={styles.input}
                    value={name}
                    onChange={ (e) => setName(e.target.value) }
                    />

                    <input
                    type="text"
                    placeholder="Preço do produto"
                    className={styles.input}
                    value={price}
                    onChange={ (e) => setPrice(e.target.value)}
                    />

                    <textarea
                        placeholder="Descreve o seu produto..."
                        className={styles.input}
                        value={description}
                        onChange={ (e) => setDescription(e.target.value)}
                    />

                    <button className={styles.buttonAdd}  type="submit">
                        Cadastrar
                    </button>


                    </form>

                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/category');

    //console.log(response.data);


    return{
        props: {
            categoryList: response.data
        }
    }
})