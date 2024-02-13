# Desarrollar componentes
Cada componente requiere los siguientes elementos para considerarse completo:

- Una carpeta con el nombre del componente. 
- Una función que devuelva un componente de tipo `React.JSX.Element`, en un archivo `index.tsx` dentro de la carpeta del componente.
- Un archivo `defs.ts` con todas las interfaces y tipos declarados.
- Una carpeta `test/` con un conjunto de tests unitarios que abarque adecuadamente las funcionalidades del componente.
- Opcionalmente, un archivo `func.ts` con la lógica en funciones, si se requiere.

## Requerimientos
### Manejo de valores y estado
Manejar estado con `useState` y evitar el uso de variables, teniendo en cuenta que en cada actualización del componente el contenido de las variables comunes se pierde. 
Ejemplo: 
```typescript
const [ name, setName ] = useState<string>("");
```

### Declarar tipos e interfaces usadas
Es obligatorio declarar y definir las interfaces que el componente usa en el archivo `defs.ts`.
Ejemplo: 
```typescript
const a: string = ""; // Sí

const b = ""; // No
const c: any = ""; // Tampoco
```

```typescript
interface MyFunctionData {
  name: string,
  age: number
}
const myFunction = (data: MyFunctionData): void => { ... } // Sí
const getName = ({ name }: MyFunctionData): string => name; // También

const badFunction = (data) => { ... } // No.
const anotherBadFunction = (data: any): any => { ... } // Tampoco.
```

### Internacionalización
Es obligatorio internacionalizar cada componente. 
Los idiomas de La Colectiva son: Español, inglés y portugués.

Para internacionalizar un componente, se deberá editar cada uno de los .json en la carpeta `/src/lang/`, y en la sección `components` añadir un elemento con el nombre del componente. El contenido de ese elemento será un objeto con la siguiente estructura: 
```javascript
{
  "label": "", // Opcional, si se trata de un campo de texto.
  "title": "", // Opcional
  "actions": { /* ... */ } // Listado de acciones
  "err": { /* ... */ } // Listado de errores
  "ok": { /* ... */ } // Listado de mensajes exitosos.
  "misc": { /* ... */ } // Otros
}
```

Y luego en el componente se usará de la siguiente forma: 
```typescript
interface MiComponenteProps { /* ... */ }
const MiComponente = (props: MiComponenteProps): React.JSX.Element => {
  const { t } = useTranslation();
  /* ... */
  return (<span class="titulo"> { t('components.MiComponente.title') } </span>);
};
```
