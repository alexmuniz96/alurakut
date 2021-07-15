  import React from "react";
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

  export default function Home() {
    const [comunidades, setComunidades] = React.useState([{
      id: "1276917927172071070",
      title: "Eu odeio acordar cedo",
      image: "https://alurakut.vercel.app/capa-comunidade-01.jpg"
    }]);
    const githubUser = "alexmuniz96";
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
    React.useEffect(() => {
      fetch("https://api.github.com/users/alexmuniz96/followers")
      .then((response) => {
        return response.json()
      })
      .then((responsefinal) =>{
        setSeguidores(responsefinal)
      })
    }, [])

    return (
    <>
      <AlurakutMenu/>
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
                id: new Date().toISOString(),
                title: dadosDoForm.get("title"),
                image: dadosDoForm.get("image"),
              }
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas)

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
                    <a href={`/users/${itemAtual.title}`} key={itemAtual.title}>
                      <img src={itemAtual.image} />
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
