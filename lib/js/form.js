document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.uploader-content');
    const fileInput = document.getElementById('formFile');
    const imageCard = document.getElementById('img-uploaded');
    const imageTag = imageCard.querySelector('img');
    const nomProduit = form.querySelectorAll('input[type="text"]')[0];
    const nomPrenom = form.querySelectorAll('input[type="text"]')[1];
    const description = form.querySelector('textarea');
    const prix = form.querySelector('input[type="number"]');
    const enregistrerBtn = form.querySelector('input[type="submit"]');
    const resetBtn = form.querySelector('input[type="reset"]');
    const categorySelect = form.querySelector('select[name="category"]'); 

    const STORAGE_KEY = 'formDataList';

    const getBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    function loadFromStorage() {
        const listJSON = localStorage.getItem(STORAGE_KEY);
        if (!listJSON) return;

        let list = JSON.parse(listJSON);
        const now = new Date().getTime();

        list = list.filter(item => now < item.expiration);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        console.log(list);
        if (list.length > 0) {
            const lastItem = list[list.length - 1];
            nomProduit.value = lastItem.nomProduit;
            nomPrenom.value = lastItem.nomPrenom;
            description.value = lastItem.description;
            prix.value = lastItem.prix;
            if (lastItem.category) categorySelect.value = lastItem.category; // 🆕

            if (lastItem.image) {
                imageTag.src = lastItem.image;
                imageCard.style.display = 'block';
            }
        }
    }

    async function saveToStorage() {
        let imageBase64 = '';
        if (fileInput.files.length > 0) {
            imageBase64 = await getBase64(fileInput.files[0]);
            imageTag.src = imageBase64;
            imageCard.style.display = 'block';
        }

        const data = {
            nomProduit: nomProduit.value,
            nomPrenom: nomPrenom.value,
            description: description.value,
            prix: prix.value,
            category: categorySelect.value, // 🆕 Ajout de la catégorie
            image: imageBase64,
            expiration: new Date().getTime() + (30 * 24 * 60 * 60 * 1000)
        };

        let list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        list.push(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

        alert('Produit enregistré avec succès !');
    }

    function clearStorage() {
        localStorage.removeItem(STORAGE_KEY);
        imageTag.src = '';
        imageCard.style.display = 'none';
    }

    enregistrerBtn.addEventListener('click', () => {
        if (form.checkValidity()) {
            saveToStorage();
        } else {
            alert('Veuillez remplir tous les champs requis.');
        }
    });

    resetBtn.addEventListener('click', () => {
        clearStorage();
    });

    loadFromStorage();
});
