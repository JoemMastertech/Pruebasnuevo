/**
 * SCRIPT DE VERIFICACIÓN POST-CONSOLIDACIÓN CSS
 * Valida que los valores computados se mantienen exactos después de la consolidación
 */

function verificarConsolidacionCSS() {
  console.log('🔍 INICIANDO VERIFICACIÓN DE CONSOLIDACIÓN CSS...');
  
  // Valores esperados según análisis (desktop 1200px)
  const valoresEsperados = {
    '.product-grid': {
      'grid-template-columns': 'repeat(3, 1fr)',
      'gap': '25px',
      'padding': '25px',
      'max-width': '1400px'
    },
    '.category-grid': {
      'grid-template-columns': 'repeat(5, 1fr)',
      'gap': '25px', 
      'padding': '25px',
      'max-width': '1400px'
    },
    '.product-card': {
      'min-height': '350px'
    },
    '.product-card .product-name': {
      'font-size': '15.6px' // 0.975rem * 16px
    }
  };
  
  let errores = [];
  let verificaciones = 0;
  
  // Función para obtener valor computado
  function obtenerValorComputado(selector, propiedad) {
    const elemento = document.querySelector(selector);
    if (!elemento) {
      return null;
    }
    return window.getComputedStyle(elemento).getPropertyValue(propiedad).trim();
  }
  
  // Función para normalizar valores de grid-template-columns
  function normalizarGridColumns(valor) {
    // Convertir valores en px a 1fr si son iguales
    if (valor.includes('px')) {
      const valores = valor.split(' ');
      const primerValor = parseFloat(valores[0]);
      const todosIguales = valores.every(v => Math.abs(parseFloat(v) - primerValor) < 1);
      if (todosIguales) {
        return `repeat(${valores.length}, 1fr)`;
      }
    }
    return valor;
  }
  
  // Función para normalizar valores de font-size
  function normalizarFontSize(valor, esperado) {
    const valorNum = parseFloat(valor);
    const esperadoNum = parseFloat(esperado);
    return Math.abs(valorNum - esperadoNum) < 0.1;
  }
  
  console.log('📊 Verificando valores computados...');
  
  // Verificar cada selector y propiedad
  Object.entries(valoresEsperados).forEach(([selector, propiedades]) => {
    console.log(`\n🎯 Verificando: ${selector}`);
    
    Object.entries(propiedades).forEach(([propiedad, valorEsperado]) => {
      verificaciones++;
      const valorComputado = obtenerValorComputado(selector, propiedad);
      
      if (valorComputado === null) {
        errores.push(`❌ Elemento no encontrado: ${selector}`);
        return;
      }
      
      let coincide = false;
      
      // Verificaciones especiales según la propiedad
      if (propiedad === 'grid-template-columns') {
        const valorNormalizado = normalizarGridColumns(valorComputado);
        coincide = valorNormalizado === valorEsperado || valorComputado === valorEsperado;
      } else if (propiedad === 'font-size') {
        coincide = normalizarFontSize(valorComputado, valorEsperado);
      } else {
        coincide = valorComputado === valorEsperado;
      }
      
      if (coincide) {
        console.log(`  ✅ ${propiedad}: ${valorComputado} ✓`);
      } else {
        const error = `❌ ${selector} > ${propiedad}: esperado '${valorEsperado}', obtenido '${valorComputado}'`;
        errores.push(error);
        console.log(`  ${error}`);
      }
    });
  });
  
  // Verificar variables CSS específicas
  console.log('\n🔧 Verificando variables CSS...');
  const variablesEsperadas = {
    '--grid-columns': '3',
    '--gap': '25px',
    '--padding': '25px',
    '--card-padding': '20px',
    '--card-radius': '10px'
  };
  
  const rootStyles = getComputedStyle(document.documentElement);
  Object.entries(variablesEsperadas).forEach(([variable, valorEsperado]) => {
    verificaciones++;
    const valorVariable = rootStyles.getPropertyValue(variable).trim();
    
    if (valorVariable === valorEsperado) {
      console.log(`  ✅ ${variable}: ${valorVariable} ✓`);
    } else {
      const error = `❌ Variable ${variable}: esperado '${valorEsperado}', obtenido '${valorVariable}'`;
      errores.push(error);
      console.log(`  ${error}`);
    }
  });
  
  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMEN DE VERIFICACIÓN');
  console.log('='.repeat(60));
  console.log(`Total verificaciones: ${verificaciones}`);
  console.log(`Exitosas: ${verificaciones - errores.length}`);
  console.log(`Errores: ${errores.length}`);
  
  if (errores.length === 0) {
    console.log('\n🎉 ¡CONSOLIDACIÓN EXITOSA!');
    console.log('✅ Todos los valores se mantienen exactamente iguales');
    console.log('✅ Las variables CSS están correctamente aplicadas');
    console.log('✅ El estado visual se ha preservado completamente');
  } else {
    console.log('\n⚠️  SE DETECTARON DISCREPANCIAS:');
    errores.forEach(error => console.log(error));
    console.log('\n🔧 Revisar la implementación de variables CSS');
  }
  
  return {
    exitoso: errores.length === 0,
    errores: errores,
    verificaciones: verificaciones
  };
}

// Ejecutar verificación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', verificarConsolidacionCSS);
} else {
  verificarConsolidacionCSS();
}

// Exportar para uso manual
window.verificarConsolidacionCSS = verificarConsolidacionCSS;