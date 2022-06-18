package br.com.hotel.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.hotel.model.Hospede;

@Repository
public interface HospedeRepositorio extends JpaRepository<Hospede, Long>{
    Hospede findByverificarConfirmacao(int codigo);
}