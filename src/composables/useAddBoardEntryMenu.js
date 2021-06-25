import { ref, reactive } from 'vue'

export default function useAddBoardEntryMenu({
    onUpload = () => {},
    onLibrary = () => {},
    onSeparator = () => {},
}) {
  const addMenuElement = ref(null)
  function toggleAddMenu(event) {
    addMenuElement.value.toggle(event);
  }
  const addMenuItems = reactive([
    {
      label: 'Audio',
      items: [{
          label: 'Upload',
          icon: 'pi pi-upload',
          command: () => onUpload()
        },
        // {
        //   label: 'From library',
        //   icon: 'pi pi-book',
        //   command: () => onLibrary()
        // }
      ]
    },
    {
      label: 'Separator',
      items: [{
          label: 'Create',
          icon: 'pi pi-plus',
          command: () => onSeparator()
        }
      ]
    },
  ])

  return {
    addMenuElement,
    toggleAddMenu,
    addMenuItems
  }
}