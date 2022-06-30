package br.com.hotel.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.hotel.model.Hospede;
import br.com.hotel.model.Reserva;
import br.com.hotel.model.TipoQuarto;
import br.com.hotel.repositorio.HospedeRepositorio;
import br.com.hotel.repositorio.QuartoRepositorio;
import br.com.hotel.repositorio.ReservaRepositorio;
import br.com.hotel.repositorio.tipoQuartoRepositorio;

@RestController
public class ReservaController {
    
    @Autowired
    HospedeRepositorio hospedeRepositorio;
    @Autowired
    private ReservaRepositorio reservaRepositorio;
    @Autowired
    private QuartoRepositorio quartoRepositorio;
    @Autowired
    private tipoQuartoRepositorio tipoQuartoRepositorio;

    @PostMapping("/pesquisarReserva")
    public List<TipoQuarto> pesquisarReserva(HttpServletResponse response, @RequestParam String dataEntrada, @RequestParam String dataSaida)  throws IOException {
        LocalDate entrada = LocalDate.parse(dataEntrada);
        LocalDate saida = LocalDate.parse(dataSaida);
        List<TipoQuarto> listaTipoQuarto = tipoQuartoRepositorio.BuscarTiposQuartoTrue();
        List<TipoQuarto> disponibilidade = new ArrayList<>();
        for (TipoQuarto tipoQuarto : listaTipoQuarto) {
            if(disponibilidadeTipoQuarto(tipoQuarto, entrada, saida)){
                disponibilidade.add(tipoQuarto);
            }
        }
        return disponibilidade;
    }

    public Boolean disponibilidadeTipoQuarto(TipoQuarto tipoQuarto, LocalDate entrada, LocalDate saida){
        
        List<Reserva> listaReservas = reservaRepositorio.findAll();
        int quantidadeReservasInterferem = 0;
        for (Reserva reserva : listaReservas) {
            if(reserva.getTipoQuarto() == tipoQuarto){
                if(reserva.getDataEntrada().isBefore(saida) && reserva.getDataSaida().isAfter(entrada)){
                    quantidadeReservasInterferem++;
                }
            }
        }
        if(quantidadeReservasInterferem < quartoRepositorio.contarPeloTipoQuarto(tipoQuarto.getIdTipoQuarto())){
            return true;
        }else{
            return false;
        }
    }


    @PostMapping("/finalizarReserva")
    public Reserva cadastrarReserva(@RequestParam Long idHospede,@RequestParam String dataEntrada, @RequestParam String dataSaida, @RequestParam Double valorTotal, @RequestParam Long idTipoQuarto) {
        Reserva reserva = new Reserva();
        Optional<Hospede> hospede = hospedeRepositorio.findById(idHospede);
        Optional<TipoQuarto> tipoQuarto = tipoQuartoRepositorio.findById(idTipoQuarto);
        reserva.setHospede(hospede.get());
        System.out.println(dataSaida);
        System.out.println(dataEntrada);
        reserva.setDataEntrada(LocalDate.parse(dataEntrada));
        reserva.setDataSaida(LocalDate.parse(dataSaida));
        reserva.setValorPago(valorTotal);
        reserva.setTipoQuarto(tipoQuarto.get());
        reserva.setStatus("Não chegou");
        reserva.setMetodoPagamento("a");
        reserva.setCodigoReserva(System.currentTimeMillis());
        reservaRepositorio.save(reserva);
        return reserva;

    }

    //terminar esse método para fazer a busca da reserva efetivada p/ depois checkin nos quartos
    // @GetMapping("/pesquisarReservaEfetivada/{numero}")
    // public Quarto buscarQuarto(@PathVariable("numero") String numero) {
    //     System.out.println(numero);
    //     Quarto quarto = quartoRepositorio.findBynumero(numero);
    //     return quarto;
    // }
    
}
