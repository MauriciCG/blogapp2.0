import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
usuarios:any;
nuevoUsuario:any = {user:'',pass:'',tipo:'',nombre:''};
tmpUsuario:any = {user:'',pass:'',tipo:'',nombre:''};
  constructor(private datos:DatosService, private router:Router, private msg:ToastrService) { }

  ngOnInit(): void {
  this.llenarUsuarios();
  }
  llenarUsuarios(){
    this.datos.getUsuarios().subscribe(resp => {
      this.usuarios = resp;
      console.log(resp);

    }, error => {

     
      if(error.status==408) this.router.navigate(['']);
     
    })
  }
  agregarUsuarios(){
    if(this.nuevoUsuario.user == '' && this.nuevoUsuario.pass == '' && this.nuevoUsuario.tipo == '' && this.nuevoUsuario.nombre == ''){
      this.msg.error("Los campos user,  password ,tipo y nombre del usuario son obligatorios");
      return;
    }
    this.datos.postUsuario(this.nuevoUsuario).subscribe(resp => {
      if(resp['result']=='ok'){
        let usuario = JSON.parse(JSON.stringify(this.nuevoUsuario))
        this.usuarios.push(usuario);
        this.nuevoUsuario.user = '';
        this.nuevoUsuario.pass = '';
        this.nuevoUsuario.tipo = '';
        this.nuevoUsuario.nombre = '';
        this.msg.success("El usuario se guardo correctamente.");
      }else{
        this.msg.error("El usuario no se ha podido guardar.");
      }
    }, error => {
      console.log(error);
    });
  }
  temporalUsuario(usuario){
    this.tmpUsuario = JSON.parse(JSON.stringify(usuario));
  }
  guardarCambios(){
    this.datos.putUsuarios(this.tmpUsuario).subscribe(resp => {
      if(resp['result']=='ok'){
        let i = this.usuarios.indexOf( this.usuarios.find( usuario => usuario.user == this.tmpUsuario.user ));
        this.usuarios[i].pass = this.tmpUsuario.pass;
        this.usuarios[i].tipo = this.tmpUsuario.tipo;
        this.usuarios[i].nombre = this.tmpUsuario.nombre;
        this.msg.success("El usuario se guardo correctamente.");
      }else{
        this.msg.error("El usuario no se ha podido modificar.");
      }
    }, error => {
      console.log(error);
    });
  }

  confirmarEliminar(){
    this.datos.deleteUsuarios(this.tmpUsuario).subscribe(resp => {
      if(resp['result']=='ok'){
        let i = this.usuarios.indexOf( this.usuarios.find( usuario => usuario.user == this.tmpUsuario.user ));
        this.usuarios.splice(i,1);
        this.msg.success("El usuario se elimino correctamente.");
      }else{
        this.msg.error("El usuario no se ha podido eliminar.");
      }
    }, error => {
      console.log(error);
    });
  }
}
