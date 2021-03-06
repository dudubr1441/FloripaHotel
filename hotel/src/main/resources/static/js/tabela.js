// feito por luiz eduardo sagaz carvalho


function mostrarPopup(){
    const listaOpen = Array.from(document.querySelectorAll('.botaoPopup'))
    listaOpen.forEach(open => {
        document.querySelector('.popup').classList.add('show');
    }) 
}
function ocultarPopup(){
        document.querySelector('.popup').classList.remove('show');
}
function OpenEditPopup(idquarto){
       mostrarPopup()

        $.post('http://localhost:8089/tipoQuarto/'+idquarto,{
        }, function(tipoQuarto){
            $(".campo1Form").val(tipoQuarto.quantidadeCamaSolteiro)
            $(".campo2Form").val(tipoQuarto.quantidadeCamaCasal)
            $(".inputDisabled").val(tipoQuarto.numeroPessoas)
        })

       const popupEditar = document.getElementById('editarPopup');
       popupEditar.removeAttribute('idquarto');
       popupEditar.setAttribute('idquarto',idquarto);
       popupEditar.style.visibility = 'visible';
       popupEditar.style.display = 'flex';
       if (document.querySelector('#tituloEdit')!=null||document.querySelector('#tituloEdit')!=undefined){
           const div = $(`td[idquarto = ${idquarto}]`)
           $('#tituloEdit').html(div[0].innerText);
           const listaInput = $(`.inputDiaria${idquarto}`)
           listaDiaria = ['diaUtil','fimDeSemana','feriado','promocional']
           listaInput.each(function(index){
                document.getElementById(listaDiaria[index]).value = parseInt(formataValor(this.innerHTML))
           })
       }
}
function CloseEditPopup(){
    const listaDiv = Array.from(document.querySelectorAll('#editarPopup div'));
    for (let i = 0; i < listaDiv.length; i++) {
        const divAtual = listaDiv[i].children[1];
        switch (divAtual.tagName) {
            case 'INPUT':
                divAtual.value = ""; 
            break;
                
            case 'SELECT':
                const tipoSelect = divAtual.id;
                document.getElementById(tipoSelect).value = divAtual.children[0].value;
                break;
            }
    }
    const popupEditar = document.getElementById('editarPopup');
    popupEditar.style.visibility = 'hidden';
    popupEditar.style.display = 'none';
    ocultarPopup();
}
function gerarQNTpessoas(id){
    const NumeroPessoas = document.querySelector(`${id} input[disabled]`)
    NumeroPessoas.value = ""
    const listaCamas = document.querySelectorAll(`${id} select`)
    const camaSolteiro = parseInt($(listaCamas[0]).val());
    const camaCasal = parseInt($(listaCamas[1]).val());
    NumeroPessoas.value = camaSolteiro+(camaCasal*2);
}

function OpenDeletePopup(idquarto){
        mostrarPopup();
        const deletePopup = document.getElementById('deletePopup');
        deletePopup.removeAttribute('idquarto');
        deletePopup.setAttribute('idquarto',idquarto);
        deletePopup.style.visibility = 'visible';
        deletePopup.style.display = 'flex';
}

function CloseDeletePopup(){
    const deletePopup = document.getElementById('deletePopup');
    deletePopup.style.visibility = 'hidden';
    deletePopup.style.display = 'none';
    ocultarPopup();
}

function formataValor(valor){
    const t = valor;
    const s = valor.substring(2,valor.length)
    return s.replace(',','.')
} 

function carregarTipoQuarto(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/tipoQuarto",
        success: function (data) {
            const tabela = document.querySelector('#listerUser')
            let tr = "";
            $.each(data,function(i,value){
             tr+= `<tr class="TipoQuarto" idquarto=${value.idTipoQuarto}>
             <td>${value.tipoQuarto}</td>
             <td>${value.quantidadeCamaSolteiro}</td>
             <td>${value.quantidadeCamaCasal}</td>
             <td>${value.numeroPessoas}</td>
             <td>
                 <img src="img/excluir_lixeira_30x30px.svg" class="botaoPopup pointer" onclick=" OpenDeletePopup(${value.idTipoQuarto})">
                 <img src="img/editar_lapis_30x30px.svg" class="botaoPopup pointer" onclick="OpenEditPopup(${value.idTipoQuarto});">  
             </td>
         </tr>
         `;
            
            })
        $('.TipoQuarto').remove();
        $('#listerUser').append(tr);
    },
        error: function() {
            alert('Tipos de quarto indisponiveis')
        }
    })
}
function EditTipoQuarto(){
    const editPopup = document.getElementById('editarPopup');
    $('#idquarto').val(parseInt(editPopup.getAttribute("idquarto")))
}
function deleteTipoQuarto(){
    const deletePopup = document.getElementById('deletePopup');
    $('#idQuarto').val(parseInt(deletePopup.getAttribute("idquarto")))
    const formularioDelete = document.getElementById('formularioDelete');
    formularioDelete.submit();

    //deletePopup.querySelector()
    /*$.ajax({
        type: "POST",
        url: "tipoQuarto/delete",
        data: {
            idQuarto:deletePopup.getAttribute('idquarto')   
        },
        success: function (response) {
            alert(response)
        }
    });*/
}
