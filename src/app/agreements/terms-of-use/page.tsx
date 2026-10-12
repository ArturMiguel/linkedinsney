import type { Metadata } from "next";
import Link from "next/link";
import styles from "./styles.module.css";
import { Logo } from "@/components/Logo";
import { getLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Termos de Uso",
};

export default async function TermsOfUse() {
  const supportMail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE;
  const authorName = process.env.AUTHOR_NAME;
  const locale = await getLocale();
  const t = await getTranslations("agreements");

  return (
    <>
      <div className={styles["container"]}>
        <div className="flex justify-center mb-4">
          <Logo />
        </div>

        {locale !== "pt-BR" && (
          <p className="my-3 text-sm text-muted-foreground italic">{t("languageNotice")}</p>
        )}

        <h1>TERMOS DE USO</h1>

        <p className="my-3">Última atualização: 12 de outubro de 2026</p>

        <h3 className="my-3">ACEITAÇÃO DOS TERMOS</h3>

        <p className="my-3">
          O Linkedinsney é uma ferramenta de tradução de textos para posts corporativos no LinkedIn, alimentada por inteligência artificial.
          Cole qualquer texto honesto e receba um post impecável com buzzwords, propósito e emojis, pronto para publicação.
          O serviço é disponibilizado em <Link className="ml-1 underline underline-offset-2" href="/">{siteUrl}</Link> e mantido por {authorName}.
        </p>

        <p className="my-3">Dúvidas ou solicitações podem ser enviadas para {supportMail}.</p>

        <p className="my-3">Ao acessar ou utilizar o Linkedinsney, você declara que leu, entendeu e concorda com todos os termos descritos neste documento. SE VOCÊ NÃO CONCORDAR COM ESTES TERMOS, NÃO UTILIZE O SERVIÇO.</p>

        <p className="my-3">Informaremos previamente sobre quaisquer mudanças programadas nos Serviços que você estiver utilizando.
          As mudanças nestes Termos entrarão em vigor trinta (30) dias após o aviso, exceto se relacionadas a novas
          funcionalidades, atualizações de segurança, correções de erros ou determinações judiciais, que entrarão em vigor
          imediatamente. Ao continuar usando os Serviços após essas mudanças, você concorda com os termos modificados.</p>

        <p className="my-3">Todos os usuários menores de idade na jurisdição onde residem devem ter permissão e supervisão direta dos pais ou responsável legal para utilizar os Serviços.</p>

        <h3 className="my-3">1. NOSSOS SERVIÇOS</h3>
        <p className="my-3">
          As informações fornecidas ao utilizar os Serviços não se destinam à distribuição ou uso por qualquer pessoa ou
          entidade em qualquer jurisdição ou país onde tal distribuição ou uso sejam contrários à legislação ou regulamentação aplicável.
          Quem optar por acessar os Serviços a partir de outras localidades o faz por iniciativa própria e é integralmente responsável pelo cumprimento das leis locais.
        </p>

        <h3 className="my-3">2. DIREITOS DE PROPRIEDADE INTELECTUAL</h3>

        <h4 className="mb-3">Código-fonte aberto</h4>

        <p className="my-3">
          O código-fonte do Linkedinsney é aberto e distribuído sob a <Link className="ml-1 underline underline-offset-2" href="https://github.com/ArturMiguel/linkedinsney" target="_blank" rel="noopener noreferrer">Licença MIT</Link>.
          Qualquer pessoa pode usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e vender cópias do código-fonte, nos termos dessa licença.
        </p>

        <h4 className="mb-3">Nossa propriedade intelectual</h4>

        <p className="my-3">
          A licença do código-fonte não se estende à marca "Linkedinsney", ao logotipo e à identidade visual, que permanecem de nossa propriedade exclusiva,
          nem ao banco de dados, ao conteúdo submetido pelos usuários e aos demais dados pessoais tratados pelos Serviços, que continuam regidos por esta seção
          e pela Política de Privacidade (coletivamente, o "Conteúdo", excluído o código-fonte aberto; e as "Marcas").
        </p>

        <p className="my-3">O Conteúdo e as Marcas são fornecidos nos Serviços "NO ESTADO EM QUE SE ENCONTRAM", apenas para seu uso pessoal e não comercial.</p>

        <p className="my-3">
          Nenhuma parte do Conteúdo ou das Marcas poderá ser copiada, reproduzida, republicada, transmitida, distribuída, vendida ou explorada comercialmente sem nossa autorização prévia por escrito.
          Reservamo-nos todos os direitos não expressamente concedidos.
        </p>

        <p className="my-3">Caso deseje utilizar qualquer parte dos Serviços ou Conteúdo de maneira não prevista nestes Termos, envie sua solicitação para: {supportMail}.</p>

        <h4 className="my-3">Suas submissões</h4>

        <p className="my-3">
          Ao submeter textos para tradução, você declara que possui os direitos necessários sobre o conteúdo enviado e que este não viola direitos de terceiros nem a legislação aplicável.
          Você é o único responsável pelo conteúdo que submete. Ao enviar sugestões ou feedback sobre os Serviços, você concorda que poderemos utilizá-los livremente para qualquer finalidade, sem compensação.
        </p>

        <h3 className="my-3">3. DECLARAÇÕES DO USUÁRIO</h3>
        <p className="my-3">
          Ao utilizar os Serviços, você declara e garante que: (1) todas as informações de cadastro fornecidas por você serão verdadeiras, precisas e completas; (2) você possui capacidade legal e concorda em cumprir estes Termos; (3) você não acessará os Serviços por meios automatizados ou não humanos, como bots ou scripts; (4) você não utilizará os Serviços para nenhum propósito ilegal ou não autorizado; e (5) seu uso dos Serviços não violará nenhuma lei ou regulamentação aplicável.
        </p>

        <p className="my-3">
          Caso qualquer informação fornecida por você seja falsa, imprecisa ou incompleta, reservamo-nos o direito de suspender ou encerrar sua conta.
        </p>

        <h3 className="my-3">4. REGISTRO DE USUÁRIO</h3>
        <p className="my-3">
          O acesso às funcionalidades do Linkedinsney requer autenticação via conta Google. Você é responsável pela segurança do acesso à sua conta e por todo uso realizado em seu nome.
        </p>

        <h3 className="my-3">5. ATIVIDADES PROIBIDAS</h3>
        <p className="my-3">Você não pode acessar ou utilizar os Serviços para qualquer finalidade que não seja aquela para a qual eles são disponibilizados.</p>

        <p>Ao utilizar os Serviços, você concorda em NÃO:</p>
        <ul className="list-disc list-inside">
          <li>Coletar sistematicamente dados ou conteúdo dos Serviços sem nossa autorização por escrito.</li>
          <li>Enganar, fraudar ou induzir em erro outros usuários ou o próprio serviço.</li>
          <li>Contornar, desabilitar ou interferir com recursos de segurança dos Serviços.</li>
          <li>Utilizar informações obtidas dos Serviços para assediar, abusar ou prejudicar terceiros.</li>
          <li>Utilizar os Serviços de forma contrária a qualquer lei ou norma vigente.</li>
          <li>Carregar ou transmitir vírus ou qualquer outro material que interfira no uso normal dos Serviços.</li>
          <li>Fazer uso automatizado dos Serviços, como scripts, robôs ou ferramentas de extração de dados.</li>
          <li>Usurpar identidade de outro usuário ou utilizar login alheio.</li>
          <li>Interferir ou sobrecarregar os Serviços ou redes associadas.</li>
          <li>Coletar e-mails de usuários para envio de mensagens indesejadas ou criar contas de forma automatizada.</li>
          <li>Utilizar sua conta ou dados obtidos por meio dela para concorrer conosco ou para fins comerciais não autorizados, ressalvado o uso do código-fonte aberto nos termos da Licença MIT.</li>
          <li>Vender ou transferir seu perfil a terceiros.</li>
        </ul>

        <h3 className="my-3">6. LOGIN SOCIAL (GOOGLE)</h3>
        <p className="my-3">
          O Linkedinsney utiliza autenticação via Google exclusivamente para identificar o usuário. Ao autenticar-se, o Google nos fornece seu nome, endereço de e-mail e foto de perfil pública. Nenhum outro dado da sua conta Google é acessado ou armazenado.
        </p>
        <p className="my-3">
          Seu relacionamento com o Google é regido exclusivamente pelos termos do próprio Google. Não nos responsabilizamos pelo uso que o Google faz dos seus dados.
        </p>

        <h3 className="my-3">7. SITES E CONTEÚDOS DE TERCEIROS</h3>
        <p className="my-3">
          Os Serviços podem conter links para outros sites. Esses elementos não são verificados ou monitorados por nós. Não nos responsabilizamos por quaisquer sites de terceiros acessados pelos Serviços, incluindo suas práticas ou políticas de privacidade.
        </p>

        <h3 className="my-3">8. GERENCIAMENTO DOS SERVIÇOS</h3>
        <p className="my-3">
          Reservamo-nos o direito, mas não a obrigação, de: (1) monitorar os Serviços quanto a violações destes Termos; (2) tomar medidas legais contra quem os violar; (3) restringir ou desabilitar o acesso de usuários que os violem; e (4) administrar os Serviços de forma a proteger nossos direitos e garantir seu funcionamento adequado.
        </p>

        <h3 className="my-3">9. POLÍTICA DE PRIVACIDADE</h3>
        <p className="my-3">
          Nos importamos com sua privacidade. Leia nossa Política de Privacidade: <Link className="ml-1 underline underline-offset-2" href="/agreements/privacy-policy">{siteUrl}/agreements/privacy-policy</Link>. Ao usar os Serviços, você concorda com essa política, que está incorporada a estes Termos.
        </p>

        <h3 className="my-3">10. VIGÊNCIA E RESCISÃO</h3>
        <p className="my-3">
          Estes Termos permanecerão em vigor enquanto você usar os Serviços. Podemos, a nosso critério exclusivo, bloquear o acesso de qualquer usuário por violação destes Termos ou da lei, sem aviso prévio. Podemos encerrar sua conta e remover qualquer conteúdo a qualquer momento.
        </p>
        <p className="my-3">
          Se sua conta for encerrada, você não poderá criar outra sem nossa autorização. Poderemos tomar as medidas legais cabíveis, incluindo ação judicial ou medidas cautelares.
        </p>

        <h3 className="my-3">11. MODIFICAÇÕES E INTERRUPÇÕES</h3>
        <p className="my-3">
          Podemos alterar, suspender ou encerrar os Serviços a qualquer momento, sem aviso. Não garantimos disponibilidade contínua. Não nos responsabilizamos por perdas ou danos decorrentes de interrupções ou indisponibilidades.
        </p>

        <h3 className="my-3">12. LEI APLICÁVEL E JURISDIÇÃO</h3>
        <p className="my-3">
          Estes Termos são regidos pelas leis do Brasil. Quaisquer disputas decorrentes destes Termos serão submetidas à jurisdição exclusiva dos tribunais brasileiros.
        </p>

        <h3 className="my-3">13. ISENÇÃO DE RESPONSABILIDADE</h3>
        <p className="my-3">
          OS SERVIÇOS SÃO FORNECIDOS "NO ESTADO EM QUE SE ENCONTRAM". O USO É POR SUA CONTA E RISCO. NA MÁXIMA EXTENSÃO PERMITIDA PELA LEI, ISENTAMO-NOS DE TODAS AS GARANTIAS. NÃO NOS RESPONSABILIZAMOS POR: (1) ERROS OU IMPRECISÕES NO CONTEÚDO GERADO; (2) ACESSO NÃO AUTORIZADO A DADOS; (3) INTERRUPÇÕES DO SERVIÇO; (4) VÍRUS OU MALWARE TRANSMITIDOS POR TERCEIROS.
        </p>

        <h3 className="my-3">14. LIMITAÇÃO DE RESPONSABILIDADE</h3>
        <p className="my-3">
          EM NENHUMA HIPÓTESE SEREMOS RESPONSÁVEIS POR DANOS DIRETOS, INDIRETOS, LUCROS CESSANTES, PERDA DE DADOS OU OUTROS PREJUÍZOS DECORRENTES DO USO DOS SERVIÇOS, MESMO QUE TENHAMOS SIDO ADVERTIDOS SOBRE A POSSIBILIDADE DE TAIS DANOS.
        </p>

        <h3 className="my-3">15. INDENIZAÇÃO</h3>
        <p className="my-3">
          Você concorda em nos indenizar contra qualquer perda, dano ou demanda resultante de: (1) uso dos Serviços em violação destes Termos; (2) violação de direitos de terceiros; (3) conteúdo submetido que viole a lei ou direitos alheios.
        </p>

        <h3 className="my-3">16. DADOS DO USUÁRIO</h3>
        <p className="my-3">
          Mantemos os dados transmitidos aos Serviços conforme descrito na Política de Privacidade. Não nos responsabilizamos por perdas ou corrupção de dados decorrentes de falhas técnicas fora do nosso controle.
        </p>

        <h3 className="my-3">17. DISPOSIÇÕES GERAIS</h3>
        <p className="my-3">
          Estes Termos e a Política de Privacidade constituem o acordo integral entre você e nós. Se qualquer cláusula for considerada inválida, o restante permanecerá válido. Nossa omissão no exercício de qualquer direito não implica renúncia. Nada nestes Termos cria vínculo de parceria, agência ou emprego entre as partes.
        </p>

        <h3 className="my-3">18. FALE CONOSCO</h3>
        <p className="my-3">
          Para esclarecer dúvidas ou registrar reclamações sobre os Serviços, entre em contato:
        </p>
        <p>{authorName} - {supportMail}</p>
      </div>
    </>
  );
}
