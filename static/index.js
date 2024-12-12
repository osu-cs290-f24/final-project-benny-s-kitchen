function addIngredientFieldGroup(defaultValue = "") {
  console.log(`Add ingredient group: ${defaultValue}`)
  $('#ingredientsContainer').append(`
    <div class="field-group delete-to-clear">
      <input type="text" name="ingredient[]" placeholder="e.g. 2 cups flour" value="${defaultValue}" required />
      <span class="remove-field">X</span>
    </div>
  `);
}

function addInstructionFieldGroup(defaultValue = "") {
  console.log(`Add instruction group: ${defaultValue}`)
  $('#instructionsContainer').append(`
    <div class="field-group delete-to-clear">
      <input type="text" name="instruction[]" placeholder="Bring water to boil" value="${defaultValue}" required />
      <span class="remove-field">X</span>
    </div>
  `);
}

// Add a new ingredients field
$('#add-ingredient-button').on('click', function () {
  addIngredientFieldGroup();
});

// Add a new instruction field
$('#add-instruction-button').on('click', function () {
  addInstructionFieldGroup();
});

// Remove a field when clicking the 'X'
// Use event delegation since fields are dynamically added
$(document).on('click', '.remove-field', function () {
  $(this).closest('.field-group').remove();
});

function hideModal(modal_id) {
  $(modal_id).addClass("hidden");
}
function showModal(modal_id) {
  $(modal_id).removeClass("hidden");
}
function clearModal(modal_id) {
  $(`${modal_id} input`).val('');
  $(`${modal_id} textarea`).val('');
  $(`${modal_id} input[type=checkbox]`).prop('checked', false);
  $(`${modal_id} div.delete-to-clear`).remove();
}

function hideAddRecipeModal() {
  hideModal("#add-recipe-modal");
}

function showAddRecipeModal() {
  showModal("#add-recipe-modal");
}

function showEditRecipeModal() {
  fillEditRecipeModal()
  showModal("#add-recipe-modal")
}

function clearAddRecipeModal() {
  clearModal("#add-recipe-modal");
}

$("#add-recipe").on("click", function () {
  showAddRecipeModal();
});

$("#close-add-recipe-modal").on("click", function () {
  clearAddRecipeModal();
  hideAddRecipeModal();
});

$("#edit-recipe-button").on("click", function () {
  showEditRecipeModal();
});

function fillEditRecipeModal() {
  const fullRecipe = $("div.full-recipe")
  const id = fullRecipe.attr("data-id")
  const title = fullRecipe.attr("data-title");
  const description = fullRecipe.find("div.recipe-page-details p1").text();
  const mealType = fullRecipe.attr("data-mealtype");
  const difficulty = fullRecipe.attr("data-difficulty");
  const preptime = fullRecipe.attr("data-preptime");
  const categoryTags = fullRecipe.attr('data-categorytags').trim().split(' ');
  console.log(categoryTags)
  $('#add-recipe-form input[name="title"]').first().val(title);
  $('#add-recipe-form textarea[name="description"]').first().val(description);

  $("div#recipe-page-ingredients li").each((index, element) => {
    if (index > 0) {
      addIngredientFieldGroup($(element).text());
    }
    else {
      $("div#ingredientsContainer div.field-group input").first().val($(element).text());
    }
  })

  $("div#recipe-page-instructions li").each((index, element) => {
    if (index > 0) {
      addInstructionFieldGroup($(element).text());
    }
    else {
      $("div#instructionsContainer div.field-group input").first().val($(element).text());
    }
  })

  $('#add-recipe-form select[name="difficulty"]').val(difficulty);
  $('#add-recipe-form input[name="preptime"]').val(preptime);
  $('#add-recipe-form input[name="category"]').each((index, element) => {
    if (categoryTags.includes($(element).val())) {
      $(element).prop("checked", true)
    }
  });
  $('#add-recipe-form select[name="meal-type"]').val(mealType);
  //recipeCategoryTags = $(element).attr('data-categorytags').split(' ')
  //recipeMealType = $(element).attr('data-mealtype')
}

$("#add-recipe-form").on("submit", async function (event) {
  event.preventDefault()
  const mode = $("#add-recipe-modal mode").text();
  const title = $('#add-recipe-form input[name="title"]').val().trim();
  //console.log(title)
  let ingredients = $('#add-recipe-form input[name="ingredient[]"]').map(function () {
    return $(this).val().trim();
  }).get();

  //console.log(ingredients)
  //return

  let instructions = $('#add-recipe-form input[name="instruction[]"]').map(function () {
    return $(this).val().trim();
  }).get();

  const description = $('#add-recipe-form textarea[name="description"]').val().trim();
  const difficulty = $('#add-recipe-form select[name="difficulty"]').val().trim();
  const mealType = $('#add-recipe-form select[name="meal-type"]').val().trim();
  const categoryTags = $('#add-recipe-form input[name="category"]:checked').map(function () {
    return $(this).val().trim();

  }).get();

  const preparationTime = Number($('input[name="preptime"]').val())

  const form = event.target;
  const formData = new FormData();

  // Append form fields to FormData
  formData.append('title', title);
  formData.append('description', description);
  formData.append('ingredients', JSON.stringify(ingredients));
  formData.append('instructions', JSON.stringify(instructions));
  formData.append('categoryTags', JSON.stringify(categoryTags));
  formData.append('preparationTime', preparationTime);
  formData.append('difficulty', difficulty);
  formData.append('mealType', mealType);

  // Append the file if selected
  const fileInput = form.image;
  if (fileInput.files[0]) {
    console.log("Image found")
    console.log(typeof (fileInput.files[0]))
    console.log(fileInput.files[0])
    formData.append('image', fileInput.files[0]);
  }

  try {
    // Send FormData to the backend
    const method = (mode === "edit") ? "PUT" : ((mode === "add") ? "POST" : undefined)
    console.log(method);
    console.log(formData);

    let response = undefined

    if (mode === "edit") {
      const id = $("div.full-recipe").attr("data-id")
      if (id) {
        response = await fetch(`http://localhost:3000/recipes/${id}`, {
          method: "PUT",
          body: formData,
        });
      }
      else {
        console.error('Error submitting recipe:', id);
        alert('Failed to submit recipe.');
      }
    }
    else if (mode === "add") {
      response = await fetch('http://localhost:3000/recipes', {
        method: "POST",
        body: formData,
      });
    }

    if (!response.ok) {
      console.error('Error submitting recipe:', await response.json());
      alert('Failed to submit recipe.');
    }

    const result = await response.json();
    alert('Recipe submitted successfully!');
    console.log(result);

    clearAddRecipeModal();
    hideAddRecipeModal();

    location.reload(true)

    return
  } catch (error) {
    console.error('Error submitting recipe:', error);
    alert('Failed to submit recipe.');
  }
})

$('input[name="preptime"]').on("input", function (e) {
  e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-integer characters
})

function hideSearchModal() {
  hideModal("#search-modal");
}

function showSearchModal() {
  showModal("#search-modal");
}

function clearSearchModal() {
  clearModal("#search-modal");
}

$("#open-search-modal").on("click", function () {
  $("#preptime-filter-time").val(`${$("#slider-range").slider("values", 0)}m - ${$("#slider-range").slider("values", 1)}m`);
  showSearchModal();
});

$("#close-search-modal").on("click", function () {
  //clearSearchModal();
  hideSearchModal();
});

$("#slider-range").slider({
  range: true,
  min: 0,
  max: 180,
  values: [10, 120],
  slide: function (event, ui) {
    $("#preptime-filter-time").val(`${ui.values[0]}m - ${ui.values[1]}m`);
  }
});

function matchRecipe(recipe_data, filters, debug = false) {
  if (debug) {
    console.log("Matching\n");
    console.log(recipe_data);
    console.log(filters);
  }
  const preptimeMatch = filters["preparationTimeMin"] ? (recipe_data["preptime"] >= filters["preparationTimeMin"]) && (recipe_data["preptime"] <= filters["preparationTimeMax"]) : true;
  const titleMatch = filters.title ? (recipe_data.title.includes(filters.title)) : true;
  const categoryMatch = (filters.categoryTags.length > 0) ? ((filters.categoryTags.filter(value => recipe_data.categoryTags.includes(value))).length > 0) : true;
  const mealTypeMatch = filters.mealType ? (filters.mealType === recipe_data.mealType) : true;
  const difficultyMatch = filters.difficulty ? (filters.difficulty === recipe_data.difficulty) : true;
  if (debug) {
    console.log([preptimeMatch, titleMatch, categoryMatch, mealTypeMatch, difficultyMatch]);
  }
  matched = (preptimeMatch && titleMatch && categoryMatch && mealTypeMatch && difficultyMatch);
  return matched;
}

$("#search-filters").on("submit", async function (event) {
  event.preventDefault()
  console.log("DEBUGGG")
  const titleQuery = $('#search-filters input[name="search-query"]').val().trim();

  const mealTypeQuery = $('#search-filters select[name="meal-type"]').val().trim();
  const difficultyQuery = $('#search-filters select[name="difficulty"]').val().trim();

  const categoryTagsQuery = $('#search-filters input[name="category"]:checked').map(function () {
    return $(this).val().trim();
  }).get();

  const preparationTimeMin = Number($("#slider-range").slider("values", 0))
  const preparationTimeMax = Number($("#slider-range").slider("values", 1))

  let recipesList = $("div.recipe")

  let filters = {
    title: titleQuery.toLocaleLowerCase(),
    mealType: mealTypeQuery,
    difficulty: difficultyQuery,
    categoryTags: categoryTagsQuery,
    preparationTimeMin: preparationTimeMin,
    preparationTimeMax: preparationTimeMax
  }

  recipesList.each((index, element) => {
    const recipePreptime = Number($(element).attr('data-preptime'))
    const recipeTitle = $(element).attr('data-title')
    console.log(recipeTitle)
    const recipeCategoryTags = $(element).attr('data-categorytags').split(' ')
    const recipeMealType = $(element).attr('data-mealtype')
    const recipeDifficulty = $(element).attr('data-difficulty')
    let recipeData = {
      preptime: recipePreptime,
      title: recipeTitle.toLocaleLowerCase(),
      categoryTags: recipeCategoryTags,
      mealType: recipeMealType,
      difficulty: recipeDifficulty
    }
    let matched = matchRecipe(recipeData, filters, true)
    if (!matched) {
      $(element).addClass("hidden");
    }
    else {
      $(element).removeClass("hidden");
    }
  })
})

async function deleteRecipe(id) {
  try {
    //
    response = await fetch(`http://localhost:3000/recipes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error('Error deleting recipe:', await response.json());
      alert('Failed to delete recipe.');
    }
    else {
      location.href = "/"
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    alert('Failed to delete recipe.');
  }
}

$("#delete-recipe-button").on("click", async function (event) {
  const id = $("div.full-recipe").attr("data-id")
  $("#dialog-confirm").dialog({
    resizable: false,
    height: "auto",
    width: 400,
    modal: true,
    buttons: {
      "Delete all items": async function () {
        await deleteRecipe(id);
        $(this).dialog("close");
      },
      Cancel: function () {
        $(this).dialog("close");
      }
    }
  });
})


