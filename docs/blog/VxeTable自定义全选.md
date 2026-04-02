# VxeTable自定义全选

```html
<erd-checkbox
    :indeterminate="isIndeterminate"
    v-model="isCheckAll"
    @change="handleCheckAll"
>
</erd-checkbox>
```

```vue
<script>
export default {
  methods: {
    handleSelectChange() {
      const { tableList } = this;
      const selectedData = this.getSelectedData();
      if (selectedData.length >= tableList.length) {
        this.isIndeterminate = false;
        this.isCheckAll = true;
      } else if (selectedData.length > 0) {
        this.isIndeterminate = true;
      } else {
        this.isIndeterminate = false;
        this.isCheckAll = false;
      }

      this.selectedData = selectedData;
    },
    handleCheckAll(checked) {
      this.isIndeterminate = false;
      if (checked) {
        this.$refs.table.$table.setCheckboxRow(this.tableList, true);
      } else {
        this.isCheckAll = false;
        this.$refs.table.$table.clearCheckboxRow();
      }
      this.selectedData = this.getSelectedData();
    }
  }
}
</script>
```