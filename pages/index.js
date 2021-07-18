  import React from "react";
  import nookies from "nookies"
  import jwt from "jsonwebtoken"
  import MainGrid from "../src/components/MainGrid"
  import Box from "../src/components/Box"
  import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from "../src/lib/AlurakutCommons";
  import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

  function ProfileSidebar(propriedades) {
    return (
      <Box as="aside" >
        <img src= {`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: "8px"}}/>
        
        <hr/>

        <p>
          <a className="boxLink" href= {`https://github.com/${propriedades.githubUser}.png`}>
            @{propriedades.githubUser}
          </a>
        </p>

        <hr/>

        <AlurakutProfileSidebarMenuDefault/>
      </Box>
    ) 
  }

  function ProfileRelationsBox(propriedades) {
    console.log(propriedades)
    return (
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">{propriedades.title} ({propriedades.items.length})</h2>
  
        <ul>
          {propriedades.items.slice(0,6).map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a href={itemAtual.html_url} target="_blank" rel="noopener noreferrer">
                  <img src={itemAtual.avatar_url} />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            ); 
          })}
        </ul>
      </ProfileRelationsBoxWrapper>
    )
  }

  export default function Home(props) {
    const [comunidades, setComunidades] = React.useState([]);
    const githubUser = props.githubUser;
    // const comunidades = ["AluraKut"];
    const pessoasFavoritas = [
      'juunegreiros',
      'omariosouto',
      'peas',
      'rafaballerini',
      'marcobrunodev',
      'felipefialho'
    ]

    const [seguidores, setSeguidores] = React.useState([]);
    //Consumindo a api do github
    React.useEffect(() => {
      fetch("https://api.github.com/users/alexmuniz96/followers")
      .then((response) => {
        return response.json()
      })
      .then((responsefinal) =>{
        setSeguidores(responsefinal)
      })

      // Api GraphQl
      fetch("https://graphql.datocms.com/", {
        method: "POST",
        headers: {
          'Authorization': '10e9af3b48133d8c6d785fdaaddfff',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ "query": ` query{
          allCommunities {
            title
            id
            imageUrl
            creatorSlug
          }
        }`})
      })
      .then( (response) => response.json() )
      .then((responsecomplete) => {
        const communitiesDato = responsecomplete.data.allCommunities;
        setComunidades(communitiesDato)
        console.log(communitiesDato)} )

    }, [])

    return (
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea"}} >  
        <ProfileSidebar githubUser={githubUser}/>   
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea"}}>
          <Box a >
            <h1 className="title"> 
              Bem Vindo 
            </h1> 
            <OrkutNostalgicIconSet/>
          </Box>  

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2> 
            <form onSubmit={(e) =>{
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              const comunidade = {
                title: dadosDoForm.get("title"),
                imageUrl: dadosDoForm.get("image"),
                creatorSlug: githubUser
              }

              fetch("/api/comunidade", {
                method: "POST",
                headers:{
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) =>{
                const dados = response.json();
                console.log(dados.recordCreated);
                const comunidade = dados.recordCreated;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas)
              })



            }}>
              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma url para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma url para usarmos de capa"
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form> 
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: "profileRelationsArea"}}>

          <ProfileRelationsBox title="Seguidores" items={seguidores}/>

          <ProfileRelationsBoxWrapper >
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.slice(0,6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`} key={itemAtual.title}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper >

            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>  

            <ul>
              {pessoasFavoritas.slice(0,6).map((itemAtual) =>{
                return(
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

          </ProfileRelationsBoxWrapper>      

        </div>
      </MainGrid>

    </>
    )
  }

  export async function getServerSideProps(context) {
    const cookies = nookies.get(context);
    const token = cookies.USER_TOKEN;
    const { githubUser } = jwt.decode(token);
    

    const { isAuthenticated } = await fetch("http://localhost:3000/api/auth", {
      headers: {
        Authorization: token,
      },
    })
    .then((resposta) => resposta.json())
  
    if(!isAuthenticated) {
      return {
        redirect:{
          destination: "/login",
          permanent: false,
        }
      }
    }
  
   

    return {
      props: {
        githubUser
      },
    }
  }
