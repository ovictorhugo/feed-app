import React, { useEffect, useState } from "react";
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { ArrowCircleUp, ArrowRight, BookmarkSimple, Buildings, File, GraduationCap, MagnifyingGlass, MapPin, PuzzlePiece, Star, User, X, YoutubeLogo, FileCsv } from "phosphor-react";
import { process } from "@progress/kendo-data-query";
import "@progress/kendo-theme-material/dist/all.css";
import { Circle } from "../svg/Circle";
import bg_popup from '../../assets/bg_popup.png';
import { Button } from "@progress/kendo-react-buttons";

// Definição do tipo para os dados de pesquisa
type Research = {
  among: number;
  articles: number;
  book: number;
  book_chapters: number;
  id: string;
  name: string;
  university: string;
  lattes_id: string;
  area: string;
  lattes_10_id: string;
  abstract: string;
  city: string;
  orcid: string;
  image: string;
  graduation: string;
  patent: string;
  software: string;
  brand: string;
  lattes_update: Date;
};

export function GridTemplate() {
  //  URL da API
  const [urlGeral, setUrlGeral] = useState("http://200.128.66.226:8080/");
  // armazenar dados dos pesquisadores
  const [researcher, setResearcher] = useState<Research[]>([]);
  // dados em formato JSON para download
  const [jsonData, setJsonData] = useState<any[]>([]);
  //barra de pesquisa
  const [filterValue, setFilterValue] = useState("educacao");

  // URL para pesquisa de pesquisadores
  const urlTermPesquisadores = `${urlGeral}researcher?terms=${filterValue}&university=&type=ARTICLE&graduate_program_id=`;

  // buscar dados dos pesquisadores ao carregar a página ou quando o valor de filtragem muda
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlTermPesquisadores, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setResearcher(data);
          setJsonData(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [urlTermPesquisadores]);

  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [dataState, setDataState] = useState({ skip: 0, take: 10 });
  const [result, setResult] = useState(process(researcher, dataState));

  // Atualizar dados quando o estado de filtragem muda
  useEffect(() => {
    setResult(process(researcher, dataState))
  }, [filterValue]);

  // Função chamada quando o estado de dados muda
  const onDataStateChange = (event: any) => {
    setDataState(event.dataState);
    setResult(process(researcher, event.dataState));
  };

  // Componente para exibir o nome do pesquisador
  const NameResearcher = (props: any) => {
    const { dataItem } = props;

    return (
      <td className="flex items-center gap-2 h-8">
        <div
          className="bg-cover bg-center bg-no-repeat h-8 w-8 rounded-lg whitespace-nowrap border-gray-300 border-[1px]"
          style={{
            backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${dataItem.lattes_id})`,
          }}
        ></div>
        <p className="text-md  text-gray-500 whitespace-nowrap h-8">{dataItem.name}</p>
      </td>
    );
  };

  // Componente para exibir a área do pesquisador
  const AreaResearcher = (props: any) => {
    const { dataItem } = props;

    return (
      <td className="">
        <div className="flex gap-3">
          {dataItem?.area && dataItem.area !== '' ? (
            dataItem.area.split(';').map((value: any, index: any) => (
              <li
                key={index}
                className={`py-2 whitespace-nowrap px-4 rounded-md w-fit text-xs font-bold flex gap-2 text-white items-center ${value.includes('CIENCIAS AGRARIAS') ? 'bg-red-400' : value.includes('CIENCIAS EXATAS E DA TERRA') ? 'bg-green-400' : value.includes('CIENCIAS DA SAUDE') ? 'bg-[#20BDBE]' : value.includes('CIENCIAS HUMANAS') ? 'bg-[#F5831F]' : value.includes('CIENCIAS BIOLOGICAS') ? 'bg-[#EB008B]' : value.includes('ENGENHARIAS') ? 'bg-[#FCB712]' : value.includes('CIENCIAS SOCIAIS APLICADAS') ? 'bg-[#009245]' : value.includes('LINGUISTICA LETRAS E ARTES') ? 'bg-[#A67C52]' : value.includes('OUTROS') ? 'bg-[#1B1464]' : 'bg-[#000]'}
                `}
              >
                <PuzzlePiece size={12} className="text-white" /> {value.trim()}
              </li>
            ))
          ) : (
            ''
          )}
        </div>
      </td>
    );
  };

  // Componente para exibir a universidade do pesquisador
  const UniversityResearcher = (props: any) => {
    const { dataItem } = props;

    return (
      <td className="flex items-center gap-2">
        {dataItem.image == "None" ? (
          <Buildings size={16} className="text-gray-500" />
        ) : (
          <img src={dataItem.image} alt="" className="h-6" />
        )}
        <p className="text-md  text-gray-500">{dataItem.university}</p>
      </td>
    );
  };

  // Componente para exibir a cidade do pesquisador
  const CityResearcher = (props: any) => {
    const { dataItem } = props;

    return (
      <td className="">
        {dataItem.city != "None" ? (
          <div className="bg-blue-400 py-2 px-4 text-white w-fit rounded-md text-xs font-bold flex gap-2 items-center"><MapPin size={12} className="textwhite" /> {dataItem.city}</div>
        ) : ('')}
      </td>
    );
  };

  // Componente para exibir a frequência do termo de pesquisa
  const FrequencyResearcher = (props: any) => {
    const { dataItem } = props;

    return (
      <td className="flex gap-3 relative h-8">
        <div className="text-blue-400 flex text-sm font-bold gap-3">
          {dataItem.among} ocorrências
        </div>
      </td>
    );
  };

  // Componente para exibir a titulação do pesquisador
  const GraduationResearcher = (props: any) => {
    const { dataItem } = props;

    return (
      <td className="">
        {dataItem.graduation != '' ? (
          <div className={`bg-blue-400 py-2 px-4 text-white rounded-md text-xs font-bold flex gap-2 items-center w-fit`}><GraduationCap size={12} className="textwhite" /> {dataItem.graduation}</div>
        ) : ('')}
      </td>
    );
  };

  // Componente para exibir a produção do pesquisador
  const ProductionResearcher = (props: any) => {
    const { dataItem } = props;

    return (
      <td className="">
        <div className={`flex gap-3`}>
          <div className=" border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 whitespace-nowrap rounded-md text-xs font-medium">{dataItem.articles} artigos</div>
          <div className="border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 whitespace-nowrap rounded-md text-xs font-medium">{dataItem.book} livros</div>
          <div className=" border-[1px] border-gray-300 py-2 flex px-4 text-gray-400 whitespace-nowrap rounded-md text-xs font-medium">{dataItem.book_chapters} capítulos de livros</div>
        </div>
      </td>
    );
  };

  // Função para converter dados JSON em CSV
  const convertJsonToCsv = (json: any[]): string => {
    const items = json;
    const replacer = (key: string, value: any) => (value === null ? '' : value); // Lidar com valores nulos
    const header = Object.keys(items[0]);
    const csv = [
      '\uFEFF' + header.join(';'), // Adicionar BOM e cabeçalho CSV
      ...items.map((item) =>
        header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(';')
      ) // Dados CSV
    ].join('\r\n');

    return csv;
  };

  // Função para lidar com o download do arquivo CSV
  const handleDownloadJson = async () => {
    try {
      const csvData = convertJsonToCsv(jsonData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `pesquisadores.csv`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[100vh]">
      <div className="absolute w-full top-0 left-0 z-[-9]">
        <div className="w-full h-[65vh] bg-blue-400">
          <div
            className="w-full h-full bg-cover opacity-20"
            style={{ backgroundImage: `url(${bg_popup})` }}
          ></div>
        </div>
      </div>

      <div className="md:px-16 px-6 my-24 flex justify-center flex-col">
        <div className="h-[300px] absolute ml-16 z-[-9]  hidden md:flex">
          <Circle />
        </div>
        <h1 className="z-[999999] text-4xl mb-4 font-medium max-w-[750px] text-white">
          Experimente{" "}
          <strong className="bg-red-400 text-white font-normal">
            pesquisar um tema
          </strong>{" "}
          e veja o que a plataforma pode filtrar para você.
        </h1>
        <p className="z-[999999] max-w-[620px] text-lg text-white">
          O principal objetivo desse sistema é identificar as competências
          individuais e coletivas dos profissionais na Bahia.
        </p>

        <div className="flex gap-3 w-full">
          <div className="flex items-center md:w-1/2 w-full mt-4 justify-center h-12 border-gray-300 border-[1px] rounded-xl bg-white hover:border-blue-400 group-focus:border-blue-400">
            <MagnifyingGlass size={20} className={`text-gray-400 min-w-[52px]`} />
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder="Nome do programa de pós-graduação"
              className="w-full outline-none text-sm group"
            />
          </div>
        </div>
      </div>

      <div className="md:px-16 px-6 rounded-lg">
        <Grid
          data={result}
          className="rounded-lg mb-16"
          pageable={{
            pageSizes: true,
          }}
          sortable={true}
          style={{ overflowX: "auto" }}
          total={researcher.length}
          filterable={true}
          expandField="expanded"
          groupable={true}
          onDataStateChange={onDataStateChange}
          size={"small"}
          {...dataState}
        >

          <GridToolbar>
            <button onClick={handleDownloadJson} className="flex items-center gap-4 bg-blue-400 text-white rounded-lg px-6 py-2 ml-auto justify-center hover:bg-blue-500 font-medium transition"><FileCsv size={16} className="text-white" />Download CSV</button>
          </GridToolbar>

          <Column
            field="name"
            title="Nome do pesquisador"
            cells={{
              data: NameResearcher
            }}
          ></Column>

          <Column 
            field="area"
            title="Área"
            cells={{
              data: AreaResearcher
            }}
          ></Column>

          <Column 
            field="city"
            title="Cidade"
            cells={{
              data: CityResearcher
            }}
          ></Column>

          <Column 
            field="university"
            title="Instituição"
            cells={{
              data: UniversityResearcher
            }}
          ></Column>

          <Column 
            field="graduation"
            title="Titulação"
            cells={{
              data: GraduationResearcher
            }}
          ></Column>

          <Column 
            field="among"
            title={`Ocorrência do termo ${filterValue}`}
            cells={{
              data: FrequencyResearcher
            }}
          ></Column>

          <Column 
            field="oc"
            title={`Produções`}
            cells={{
              data: ProductionResearcher
            }}
          ></Column>
        </Grid>
      </div>
    </div>
  );
}
