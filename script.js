document.addEventListener('DOMContentLoaded', function() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            const quizForm = document.getElementById('quiz');
            const submitButton = document.querySelector('button');

            // ランダムに10問を選ぶ
            const selectedQuestions = [];
            const usedQuestions = new Set();  // 既に選択された問題文を記録するためのSet

            while (selectedQuestions.length < 10) {
                const randomIndex = Math.floor(Math.random() * data.length);
                const questionText = data[randomIndex].question;

                // 既に選択されていない問題文のみを使用する
                if (!usedQuestions.has(questionText)) {
                    selectedQuestions.push(data[randomIndex]);
                    usedQuestions.add(questionText);  // 選択された問題文をSetに追加
                }
            }

            selectedQuestions.forEach((item, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question');
                questionDiv.setAttribute('data-answer', item.answer);

                // 問題番号を追加
                const questionNumber = document.createElement('span');
                questionNumber.textContent = (index + 1) + ". ";
                questionDiv.appendChild(questionNumber);

                const questionText = document.createElement('span');
                questionText.textContent = item.question;
                questionDiv.appendChild(questionText);

                const choicesList = document.createElement('ul');
                item.choices.forEach((choice, choiceIndex) => {
                    const listItem = document.createElement('li');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `q${index + 1}`;
                    input.value = choice;
                    input.id = `q${index + 1}-choice${choiceIndex}`;
                    listItem.appendChild(input);

                    const label = document.createElement('label');
                    label.setAttribute('for', input.id);
                    label.appendChild(document.createTextNode(choice));
                    listItem.appendChild(label);

                    choicesList.appendChild(listItem);
                });
                questionDiv.appendChild(choicesList);

                const feedback = document.createElement('p');
                feedback.classList.add('feedback');
                questionDiv.appendChild(feedback);

                const explanation = document.createElement('p');
                explanation.classList.add('explanation');
                explanation.textContent = item.explanation;
                explanation.style.display = 'none';
                questionDiv.appendChild(explanation);

                quizForm.insertBefore(questionDiv, submitButton);
            });
        });
});

function checkAnswers() {
    let correctCount = 0;

    const questions = document.querySelectorAll('.question');
    questions.forEach((question, index) => {
        const answer = question.getAttribute('data-answer');
        const selectedAnswer = document.querySelector(`input[name=q${index + 1}]:checked`);

        const feedback = question.querySelector('.feedback');
        const explanation = question.querySelector('.explanation');
        if (selectedAnswer && selectedAnswer.value === answer) {
            correctCount++;
            feedback.textContent = '正解!';
            feedback.style.color = 'green';
            explanation.style.display = 'block';
        } else {
            feedback.textContent = '不正解';
            feedback.style.color = 'red';
            explanation.style.display = 'block';
        }
    });

    document.getElementById('correctCount').textContent = correctCount;

    const resultMessage = document.getElementById('passOrFail');
    if (correctCount >= 6) {
        resultMessage.textContent = '合格!';
        resultMessage.style.color = 'green';
    } else {
        resultMessage.textContent = '不合格';
        resultMessage.style.color = 'red';
    }
}
