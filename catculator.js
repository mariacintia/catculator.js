function formatExponent(expression) {
    return expression.replace(/(\w+)\^(\d+)/g, '$1<sup>$2</sup>');
}

function calculate() {
    const expression = document.getElementById('functionInput').value.trim();
    const calculationType = document.getElementById('calculationType').value;

    try {
        if (calculationType === "derivative") { 
            const functionToDerive = expression;
            const derivative = math.derivative(functionToDerive, 'x');
            let formattedDerivative = derivative.toString();

            formattedDerivative = formattedDerivative
                .replace(/\*\*/g, '^')
                .replace(/\*/g, '');

            formattedDerivative = formatExponent(formattedDerivative);

            document.getElementById('result').innerHTML = `
                <p><strong>Função Original:</strong> ${functionToDerive}</p>
                <p><strong>Derivada:</strong> ${formattedDerivative}</p>
                <p><strong>Passo a Passo:</strong></p>
                <p>A derivada de ${functionToDerive} em relação a x é ${formattedDerivative}.</p>
            `;
        } else if (calculationType === "equation") {
            const [leftSide, rightSide] = expression.split("=");
            const equation = `${leftSide} - (${rightSide})`;

            const coeffs = leftSide.match(/(-?\d*\.*\d*)\*?x\^2\s*([+-]?\s*\d*\.*\d*)\*?x\s*([+-]?\s*\d*\.*\d*)/);
            if (coeffs) {
                const a = parseFloat(coeffs[1].replace(/\s+/g, '')) || 1;
                const b = parseFloat(coeffs[2].replace(/\s+/g, '')) || 0;
                const c = parseFloat(coeffs[3].replace(/\s+/g, '')) || 0;
                const discriminant = b * b - 4 * a * c;

                let solutions;
                if (discriminant > 0) {
                    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                    solutions = [x1, x2];
                } else if (discriminant === 0) {
                    const x = -b / (2 * a);
                    solutions = [x];
                } else {
                    solutions = [];
                }

                document.getElementById('result').innerHTML = `
                    <p><strong>Equação:</strong> ${expression}</p>
                    <p><strong>Resultado:</strong> x = ${solutions.join(', ') || 'Nenhuma solução real'}</p>
                    <p><strong>Passo a Passo:</strong></p>
                    <p>Resolvendo a equação ${expression} obtemos as soluções: ${solutions.join(', ') || 'Nenhuma solução real'}.</p>
                `;
            } else {
                document.getElementById('result').innerHTML = `
                    <p style="color: red;">Erro: Não foi possível identificar os coeficientes.</p>
                `;
            }
        } else {
            const result = math.evaluate(expression);
            document.getElementById('result').innerHTML = `
                <p><strong>Resultado:</strong> ${result}</p>
                <p><strong>Passo a Passo:</strong></p>
                <p>A expressão ${expression} resulta em ${result}.</p>
            `;
        }
    } catch (error) {
        document.getElementById('result').innerHTML = `
            <p style="color: red;">Erro: ${error.message}</p>
            <p>Verifique se a expressão está correta e se você está utilizando a sintaxe apropriada.</p>
        `;
    }
}
