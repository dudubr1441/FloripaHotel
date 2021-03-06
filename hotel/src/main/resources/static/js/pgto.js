function carregarDadosReserva(){
    const tipoQuarto = JSON.parse(sessionStorage.getItem('tipoQuarto'))
    const dataEntrada = new Date(sessionStorage.getItem('dataEntrada')+' 12:00:00')
    const dataSaida = new Date(sessionStorage.getItem('dataSaida')+' 12:00:00')
    const nAdultos = sessionStorage.getItem('adultos')
    const nCriancas = sessionStorage.getItem('criancas')
    const nQuartos = sessionStorage.getItem('qntdQuartos')
    var diasSemana = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]

    const diaSemanaEntrada = diasSemana[dataEntrada.getDay()]
    const diaSemanaSaida = diasSemana[dataSaida.getDay()]
    var diferenca = dataSaida.getTime() - dataEntrada.getTime()
    var diferencaEmDias = diferenca / (1000 * 3600 * 24);

    var precoTotal = 0
    document.querySelector("h2.info1").innerHTML = `${diaSemanaEntrada}, ${formatDate(dataEntrada)} - ${diaSemanaSaida}, ${formatDate(dataSaida)}`
    document.querySelector("h2.info2").innerHTML = `${nAdultos} Adulto(s), ${nCriancas} Criança(s)`
    document.querySelector("h2.info3").innerHTML = `${nQuartos} Quarto(s) ${tipoQuarto.tipoQuarto}`

    $.post("http://localhost:8089/diaria/"+tipoQuarto.idTipoQuarto,{
        }, function(Diaria){
            for(let i = 0; i < diferencaEmDias; i++){
                let diariaAtual = new Date(dataEntrada)
                diariaAtual.setDate(dataEntrada.getDate() + i)
                if(diariaAtual.getDay() == 0 || diariaAtual.getDay() == 6){
                    precoTotal += Diaria.fimDeSemana
                }else{
                    precoTotal += Diaria.diaUtil
                }
            }
            precoTotal *= nQuartos
            
            document.querySelector("h2.info4").innerHTML = `Total: R$ ${precoTotal}`
            sessionStorage.setItem('valorTotal',precoTotal)    
    })

    if(localStorage.getItem('hospede') != null){
        $("#avisoCadastro").hide()
        const hospede = JSON.parse(localStorage.getItem('hospede'))
        let campos = [
            nomeCliente = $("input[name=nomeCliente]"),
            telefoneCliente = $("input[name=telefoneCliente]"),
            cpfCliente = $("input[name=cpfCliente]"),
            enderecoCliente = $("input[name=enderecoCliente]"),
            emailCliente = $("input[name=emailCliente]"),
            nascimentoCliente = $("input[name=dataNascimentoCliente]"),
        ]
        
        campos[0].val(hospede.nome)
        campos[1].val(hospede.telefone)
        campos[2].val(hospede.cpf)
        campos[3].val(hospede.endereco)
        campos[4].val(hospede.email)
        campos[5].val(hospede.nascimento)

        campos.forEach(campo => {
            campo.prop('disabled',true)
        });
    }else{
        $(".hrLaranja").hide()
    }
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
}
function formatDate2(date){
    return [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-');
}


function finalizarReserva(){
    const hospedeV = JSON.parse(localStorage.getItem('hospede'))
    const tipoQuartoV = JSON.parse(sessionStorage.getItem('tipoQuarto'))
    const dataEntradaV = new Date(sessionStorage.getItem('dataEntrada')+' 12:00:00')
    const dataSaidaV = new Date(sessionStorage.getItem('dataSaida')+' 12:00:00')
    const valorTotalV = sessionStorage.getItem('valorTotal')
    const metodoPagamentoV = document.querySelector('input[name=divOpcaoPgto]:checked').value
    const qntQuartos = parseInt(sessionStorage.getItem('qntdQuartos'))

    if(verificarRadio() && verificarCadCartao()){
        if($("input[type=checkbox][name=salvarCartao]").is(":checked")){
            let campos = verificarCadCartao()
            $.post("http://localhost:8089/cadastrarCartao",{
                bandeira:campos[0].val(),numero:campos[1].val(),vencimento:campos[2].val(),nome:campos[3].val()
                ,cvv:campos[4].val(),tipo:campos[5].val(),idHospede:(JSON.parse(localStorage.getItem('hospede'))).idHospede
            })
        }
        $.post("http://localhost:8089/finalizarReserva",{
            metodoPagamento:metodoPagamentoV,idHospede:hospedeV.idHospede,idTipoQuarto:tipoQuartoV.idTipoQuarto,
            dataEntrada:formatDate2(dataEntradaV),dataSaida:formatDate2(dataSaidaV),valorTotal:valorTotalV,qntQuartos:qntQuartos,
        }, function(){
            alert('Verifique seu email, em instantes você receberá um código para realizar o check-in no hotel!')
            window.location.replace("http://localhost:8089/compraEfetivadaCartao")
        })
    }else if(metodoPagamentoV != "cartao"){
        $.post("http://localhost:8089/finalizarReserva",{
            metodoPagamento:metodoPagamentoV,idHospede:hospedeV.idHospede,idTipoQuarto:tipoQuartoV.idTipoQuarto,
            dataEntrada:formatDate2(dataEntradaV),dataSaida:formatDate2(dataSaidaV),valorTotal:valorTotalV,qntQuartos:qntQuartos,
        },function(){
            window.location.replace("http://localhost:8089/"+metodoPagamentoV)
        })
    }else{
        alert("Preencha seus dados de pagamento corretamente!")
    }
}
function verificarRadio(){
    if (document.querySelector('#radioCartao').checked) {
        $("#formCartao").show()
        return true
    }
    $("#formCartao").hide()
    return false
}
function verificarCadCartao(){

    let campos = [
        $("#bandeirasCartoes"),
        $(".numeroCartao"),
        $("input[type=month][name=vencimentoCartao]"),
        $("input[name=nomeCartao]"),
        $(".cvv"),
        $("select[name=selectCreditoOuDebito]")
    ]
    if(campos[0].val() == ""){
        return false
    }
    if(campos[1].val().length != 19){
        return false
    }
    if(campos[2].val() == ""){
        return false
    }
    if(campos[3].val() == ""){
        return false
    }
    if(campos[4].val().length != 3){
        return false
    }
    if(campos[5].val() == ""){
        return false
    }
    return campos
}

function carregarDadosPosPgto(){
    const tipoQuarto = JSON.parse(sessionStorage.getItem('tipoQuarto'))
    const dataEntrada = new Date(sessionStorage.getItem('dataEntrada')+' 12:00:00')
    const dataSaida = new Date(sessionStorage.getItem('dataSaida')+' 12:00:00')
    const nAdultos = sessionStorage.getItem('adultos')
    const nCriancas = sessionStorage.getItem('criancas')
    const nQuartos = sessionStorage.getItem('qntdQuartos')
    var diasSemana = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]

    const diaSemanaEntrada = diasSemana[dataEntrada.getDay()]
    const diaSemanaSaida = diasSemana[dataSaida.getDay()]
    var diferenca = dataSaida.getTime() - dataEntrada.getTime()
    var diferencaEmDias = diferenca / (1000 * 3600 * 24);

    var precoTotal = 0
    document.querySelector(".info1").innerHTML = `${diaSemanaEntrada}, ${formatDate(dataEntrada)} - ${diaSemanaSaida}, ${formatDate(dataSaida)}`
    document.querySelector(".info2").innerHTML = `${nAdultos} Adulto(s), ${nCriancas} Criança(s)`
    document.querySelector(".info3").innerHTML = `${nQuartos} Quarto(s) ${tipoQuarto.tipoQuarto}`

    $.post("http://localhost:8089/diaria/"+tipoQuarto.idTipoQuarto,{
        }, function(Diaria){
            for(let i = 0; i < diferencaEmDias; i++){
                let diariaAtual = new Date(dataEntrada)
                diariaAtual.setDate(dataEntrada.getDate() + i)
                if(diariaAtual.getDay() == 0 || diariaAtual.getDay() == 6){
                    precoTotal += Diaria.fimDeSemana
                }else{
                    precoTotal += Diaria.diaUtil
                }
            }
            precoTotal *= nQuartos
            
            document.querySelector(".info4").innerHTML = `Total: R$ ${precoTotal}`
            document.querySelector(".info5").innerHTML = `Total: R$ ${precoTotal}`
            sessionStorage.setItem('valorTotal',precoTotal)
    })
}